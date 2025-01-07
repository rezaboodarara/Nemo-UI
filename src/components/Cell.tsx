import { useState, useRef } from "react";
import playBtn from "../assets/play-button.png";
import {
  createNemoWorker,
  NemoProgramInfo,
  NemoWorker,
} from "./nemoWorker/NemoWorker";
import { FactCounts } from "./nemoWorker/NemoRunner";

function Cell({ num }: { num: number }) {
  const [programText, setProgramText] = useState('');
  const [adder, setAdder] = useState(false);
  const [cellNum, setCellNum] = useState(num);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isWorkerActive, setIsWorkerActive] = useState(false);
  const workerRef = useRef<NemoWorker | undefined>(undefined);
  const [programInfo, setProgramInfo] = useState<NemoProgramInfo | undefined>(
    undefined,
  );
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const [inputs, setInputs] = useState<{ resource: string; file: File }[]>([]);
  const [factCounts, setFactCounts] = useState<FactCounts | undefined>(
    undefined,
  );
  const [parseError, setParseError] = useState<string | undefined>(undefined);

  

  function inputSub(e: unknown): void {
    e.preventDefault();
    runProgram();
    console.log(programText);
    setAdder(!adder);
    setIsDisabled(true);
  }

  const runProgram = async () => {
    // stopProgram();

    // setIsProgramRunning(true);

    try {
      const worker = await createNemoWorker(setIsWorkerActive);
      workerRef.current = worker;
      console.debug("[ExecutionPanel] Created Nemo worker", worker);

      const programInfo = await worker.parseProgram(programText);
      await worker.markDefaultOutputs();
      programInfo.outputPredicates = (
        await worker.getOutputPredicates()
      ).sort();
      setProgramInfo(programInfo);
      setActiveKey(
        programInfo.outputPredicates[0]
          ? `predicate-${programInfo.outputPredicates[0]}`
          : undefined,
      );

      const info = await worker.start(
        Object.fromEntries(
          inputs
            .map((input) => [input.resource, input.file])
            .filter((input) => input[1] !== undefined),
        ),
      );
      // setInitializationDuration(info.initializationDuration);
      // setReasoningDuration(info.reasoningDuration);
      console.log(info.reasoningDuration);

      setFactCounts(await worker.getCounts());
    } catch (error) {
      console.warn(
        "[ExecutionPanel] Error while parsing/running program",
        error,
      );
      setParseError((error as any).toString());
    }

    // setIsProgramRunning(false);
  };
  
  return (
    <div>
      <form action="post" className="flex mb-4">
        <label htmlFor={`${cellNum}`} className="mr-2">
          cell [{cellNum}]:
        </label>
        <textarea
          name="input resize-none"
          id={`${cellNum}`}
          disabled={isDisabled}
          className="border border-slate-900 w-1/2"
          onChange={(e)=>{setProgramText(e.target.value)}}
        ></textarea>
        <button
          type="submit"
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
