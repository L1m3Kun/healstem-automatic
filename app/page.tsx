import { Panels } from "@/components/Panels";
import { Form } from "./_components/Form/Form";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex-center flex-col gap-7">
      <article className="w-full py-4 text-2xl lg:text-5xl text-bg-soft text-center">
        <h1>힐스템 입장 키오스크</h1>
      </article>
      <div className="flex flex-col-reverse gap-7 lg:w-full lg:flex-center lg:flex-row">
        <section className="">
          <Panels className="w-full">
            <p>공지나 광고내용을 넣을 곳</p>
          </Panels>
        </section>

        <section>
          <Panels className="panel flex-center flex-col lg:gap-8">
            <Form />
          </Panels>
        </section>
      </div>
    </main>
  );
}
