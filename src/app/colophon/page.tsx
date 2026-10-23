import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "編集後記",
};

export default function ColophonPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="text-xs tracking-[0.22em] text-muted-foreground">編集後記</p>
      <h1 className="mt-2 font-mincho text-4xl leading-tight font-medium">何を、残す場所か。</h1>
      <div className="mt-8 space-y-6 font-mincho text-lg leading-9">
        <p>
          日本のレコードとCDのポケットに入っていた、あの文章。音楽を説明する顔で、書き手の教養と、書き手の席を同時に主張していた。読みすぎた人は、いつか自分のほうが書けると思ってしまう。その思い上がりが、この場所の客だ。
        </p>
        <p>
          商品はコミュニティではない。署名された自尊心だ。フォローも、タイムラインも、ストーリーズも要らない。要るのは、自分の名前が音盤の横に並ぶことと、その並びを他人のいいねが動かすことだ。
        </p>
      </div>

      <Section title="いいねと、帯">
        <p>
          いいねは数える。隠すと、この客層は来ない。ただし、いいねだけで棚を並べると、残るのは郷愁と、通ぶりと、短い意地悪だ。岸辺アンリの『FOR YOU』が、その見本として創刊号の外に置いてある。いちばん推されて、帯はない。
        </p>
        <p>
          帯は編集部の権限だ。字数が800を超え、いいねが15を超えても、付くのは「帯候補」まで。候補を帯に変えるのは、数値の外側にいる人間の仕事だ。数値で帯が買えるようにした瞬間、インセンティブは死ぬ。
        </p>
      </Section>

      <Section title="報酬は、名前のほう">
        <p>
          人気の書き手に金やポイントを渡すと、景品表示と税と、やらせが先に来る。この人たちが本当に欲しいのは、印刷された自分の名前の代わりだ。だから報酬は称号にする。見習い筆者、通、訳知り、音楽評論家、選者。評論家に届くと、肩書きを自分で名乗れる。選者になると、選集の推薦枠に名が残る。
        </p>
        <p>
          金を渡すなら、後からでいい。選集を紙にして、著者に印税を渡す。読者は紙を買う。アプリ内通貨より、そのほうがライナーノーツの歴史に近い。
        </p>
      </Section>

      <Section title="書誌と、買える場所">
        <p>
          Amazonは、その盤を探せる場所として置く。Product Advertising APIの審査を、書誌の正本にしてはいけない。ジャケットの絵柄は権利がうるさい。マニアは、絵柄より先に品番が合っているかを見る。この棚の図版は、そのための組版だ。原盤の意匠は模していない。
        </p>
        <p>
          照合先はDiscogs。将来、盤を網羅するならMusicBrainzとDiscogsから引き、店へのリンクは検索に留める。最初の棚は、品番を手で確かめた十五枚だけにした。空の棚が二枚ある。氷の世界と、CAMERA TALK。空欄は欠品ではなく、挑戦状だ。
        </p>
      </Section>

      <Section title="骨子">
        <ul className="space-y-3 text-base leading-8">
          <li>
            <Link href="/albums" className="text-primary">音盤</Link>
            。アーティスト、題、年、規格、レーベル、品番、収録、クレジット。購入と照合の出口。
          </li>
          <li>
            <Link href="/albums/long-vacation" className="text-primary">稿</Link>
            。盤に紐づく、題のある文章。星はない。公開は400字、帯の審査ラインは800字。
          </li>
          <li>いいね。虚栄の数値。誰が推したかは、このデモではブラウザの中だけ。</li>
          <li>
            <Link href="/anthology" className="text-primary">帯と選集</Link>
            。編集が残す文章。いいね順では綴じない。
          </li>
          <li>
            <Link href="/writers" className="text-primary">書き手</Link>
            。受け取ったいいねで称号が動く。帯の本数は別に見る。
          </li>
          <li>
            <Link href="/me" className="text-primary">書誌</Link>
            。筆名、経歴、自分の稿、称号の進度。原稿はテキストで書き出せる。
          </li>
        </ul>
      </Section>

      <Section title="まだ、置かないもの">
        <p>
          星。短い感想。完全な匿名。公式ジャケット。フォロー。収益化。既存ライナーの転載。とくに、すでに名文がある盤の文章を、うまく言い換えて自分の教養にすること。Kind of Blueのページは、その禁止を本文にしている。
        </p>
        <p>
          筆名は残す。完全な匿名にすると、この客層はアーティストへの私怨へ滑る。人格への攻撃と、歌詞の全文と、他人のライナーの引き写しは、機能の後ではなく先に禁じる。
        </p>
      </Section>

      <Section title="このデモについて">
        <p>
          原稿もいいねも筆名も、サーバへは送らない。このブラウザの中だけに残る。書き手ページの数字は、創刊の編集稿につけた初期値だ。あなたの稿に足せる「試験読者」は、称号の動きを見るための装置で、実在の読者ではない。試験読者を足しても、帯は付かない。
        </p>
        <p>
          書誌の品番は、オリジナルに近い一枚を正本にして書いた。日本盤や再発で品番が変わる盤は、本文にそのことを書いた。違うプレスを持っている人は、その違いから稿を始めてよい。品番の話だけで終えると、帯は付かない。それも、この場所のルールだ。
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-mincho text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-8">{children}</div>
    </section>
  );
}
