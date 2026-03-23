import { Panels } from "@/components/Panels";
import { Form } from "./_components/Form/Form";

export default function Home() {
  return (
    <main className="w-full h-screen flex-center flex-col gap-7">
      <article className="w-full py-4 text-5xl text-bg-soft text-center">
        <h1>힐스템 입장 키오스크</h1>
      </article>
      <div className="w-full flex-center gap-7">
        <section className="">
          <Panels className="w-full">
            <p>공지나 광고내용을 넣을 곳</p>
          </Panels>
        </section>

        <section>
          <Panels className="panelflex-center flex-col gap-8">
            <Form />
          </Panels>
        </section>
      </div>
    </main>
  );
}
