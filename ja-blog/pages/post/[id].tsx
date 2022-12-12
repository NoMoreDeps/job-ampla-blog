import * as React from "react";
import path from 'path';
import { promises as fs } from 'fs';
import { MarksRenderer, Plugins } from "../../srcMarks/Index";
import Image from "next/image";

const marks = new MarksRenderer();
marks.targetRender = "Text";

// Register the default plugins in order to make it work
marks.registerRenderers(
  ...Plugins
  .map(_ => new _()), 
);

export async function getStaticPaths() {

  const jsonDirectory = path.join(process.cwd(), 'data/json');
  //Read the json data file data.json
  const fileContents = await fs.readFile(jsonDirectory + '/data.json', 'utf8');

  return {
    paths: JSON.parse(fileContents),
    fallback: false, // can also be true or 'blocking'
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context: any) {
  return {
    // Passed to the page component as props
    props: { post: {
      id: context.params.id,
      test: context.params.test ?? ""
    } },
  }
}

export default function Help(props: any) {

  const [num, setNum] = React.useState(0);
  const r = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setInterval(() => {
      setNum((cur) => cur + 1);
    }, 1000);
  }, [])

  marks.manualTrigger = true;
  marks.targetRender = "Text";
  const str = marks.renderToText("# Hello World");

  return (
    <div>
      Hey, I am post number {props.post.id} and {props.post.test} has been called {num} times
      <div key="test" dangerouslySetInnerHTML={{__html: str}} />
      <Image src={"/vercel.svg"} alt="" width={85} height={85} />
    </div>
  )
}
