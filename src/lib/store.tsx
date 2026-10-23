"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";
import { notes as seedNotes, writers } from "@/lib/catalog";
import { rankFor, rankWeight, TRIAL_STEP } from "@/lib/ranks";
import type { Note, UserNote } from "@/lib/types";

const STORAGE_KEY = "orenote.v1";

type Persisted = {
  penName: string;
  bio: string;
  epithet: string;
  notes: UserNote[];
  likes: string[];
};

type Store = {
  ready: boolean;
  penName: string;
  bio: string;
  epithet: string;
  likes: string[];
  userNotes: UserNote[];
  setProfile: (patch: Partial<Pick<Persisted, "penName" | "bio" | "epithet">>) => void;
  toggleLike: (id: string) => void;
  liked: (id: string) => boolean;
  publish: (input: { albumId: string; title: string; body: string }) => string;
  removeNote: (id: string) => void;
  addTrialReaders: (id: string) => void;
  likeCount: (note: Pick<Note, "id" | "baseLikes"> & { trialLikes?: number }) => number;
  allNotes: Note[];
  selfNotes: Note[];
  receivedLikes: number;
  selfRank: ReturnType<typeof rankFor>;
  writerLikes: (writerId: string) => number;
  writerNoteCount: (writerId: string) => number;
  writerWeight: (writerId: string) => number;
};

const empty: Persisted = {
  penName: "",
  bio: "",
  epithet: "",
  notes: [],
  likes: [],
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function readRaw() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): Persisted {
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<Persisted>;
    return {
      penName: parsed.penName ?? "",
      bio: parsed.bio ?? "",
      epithet: parsed.epithet ?? "",
      likes: Array.isArray(parsed.likes) ? parsed.likes : [],
      notes: Array.isArray(parsed.notes)
        ? parsed.notes.map((note) => ({ ...note, trialLikes: note.trialLikes ?? 0 }))
        : [],
    };
  } catch {
    return empty;
  }
}

function write(next: Persisted) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emit();
}

function update(mutator: (current: Persisted) => Persisted) {
  write(mutator(parse(readRaw())));
}

function subscribeReady() {
  return () => {};
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  const ready = useSyncExternalStore(subscribeReady, () => true, () => false);
  const data = useMemo(() => parse(raw), [raw]);

  const value = useMemo<Store>(() => {
    const likeCount: Store["likeCount"] = (note) =>
      note.baseLikes + (note.trialLikes ?? 0) + (data.likes.includes(note.id) ? 1 : 0);

    const selfNotes: Note[] = data.notes.map((note) => ({
      id: note.id,
      albumId: note.albumId,
      writerId: "self",
      title: note.title,
      body: note.body,
      published: note.published,
      baseLikes: note.trialLikes,
      obi: false,
    }));

    const allNotes = [...seedNotes, ...selfNotes];
    const notesByWriter = (writerId: string) => allNotes.filter((note) => note.writerId === writerId);
    const writerLikes = (writerId: string) =>
      notesByWriter(writerId).reduce((sum, note) => sum + likeCount(note), 0);
    const writerNoteCount = (writerId: string) => notesByWriter(writerId).length;

    return {
      ready,
      penName: data.penName,
      bio: data.bio,
      epithet: data.epithet,
      likes: data.likes,
      userNotes: data.notes,
      setProfile: (patch) => update((current) => ({ ...current, ...patch })),
      toggleLike: (id) =>
        update((current) => ({
          ...current,
          likes: current.likes.includes(id)
            ? current.likes.filter((like) => like !== id)
            : [...current.likes, id],
        })),
      liked: (id) => data.likes.includes(id),
      publish: ({ albumId, title, body }) => {
        const id = `local-${crypto.randomUUID()}`;
        update((current) => ({
          ...current,
          notes: [
            {
              id,
              albumId,
              title: title.trim(),
              body: body.trim(),
              published: new Date().toISOString().slice(0, 10),
              trialLikes: 0,
            },
            ...current.notes,
          ],
        }));
        return id;
      },
      removeNote: (id) =>
        update((current) => ({
          ...current,
          notes: current.notes.filter((note) => note.id !== id),
          likes: current.likes.filter((like) => like !== id),
        })),
      addTrialReaders: (id) =>
        update((current) => ({
          ...current,
          notes: current.notes.map((note) =>
            note.id === id ? { ...note, trialLikes: note.trialLikes + TRIAL_STEP } : note,
          ),
        })),
      likeCount,
      allNotes,
      selfNotes,
      receivedLikes: writerLikes("self"),
      selfRank: rankFor(writerLikes("self"), selfNotes.length),
      writerLikes,
      writerNoteCount,
      writerWeight: (writerId) => rankWeight(writerLikes(writerId), writerNoteCount(writerId)),
    };
  }, [data, ready]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

const StoreContext = createContext<Store | null>(null);

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider の外側で useStore が呼ばれました。");
  return store;
}

export function writerName(id: string, penName: string) {
  if (id === "self") return penName || "無名";
  return writers.find((writer) => writer.id === id)?.name ?? "不明な書き手";
}
