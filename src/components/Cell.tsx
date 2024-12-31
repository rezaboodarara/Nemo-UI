import React, { useEffect, useState } from "react";
import playBtn from "../assets/play-button.png";

function Cell({ num }: { num: number }) {
  const [adder, setAdder] = useState(false);
  const [cellNum, setCellNum] = useState(num);
  const [isDisabled, setIsDisabled] = useState(false);
  function inputSub(e: unknown): void {
    e.preventDefault();
    console.log("hello");
    setAdder(!adder);
    setIsDisabled(true);
  }
  return (
    <div>
      <form action="post" className="flex mb-4">
        <label htmlFor={`${cellNum}`} className="mr-2">
          cell [{cellNum}]:
        </label>
        <textarea
          name="input resize-none"
          id={`${cellNum}`}
          className="border border-slate-900 w-1/2"
        ></textarea>
        <button
          disabled={isDisabled}
          onClick={inputSub}
          className="ml-2 self-start"
        >
          <img src={playBtn} alt="start" className="w-8 h-8" />
        </button>
      </form>
      <div>
        {adder && (
          <>
            <div className="mb-10 flex justify-start">
              <p className="inline ml-7 mr-2">[{cellNum}]:</p>
              <p className=" border border-slate-900 w-1/2 text-red-400 inline-bl">
                output
              </p>
            </div>
            <Cell num={cellNum + 1} />
          </>
        )}
      </div>
    </div>
  );
}

export default Cell;
