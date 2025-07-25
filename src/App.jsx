import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("one");
  const [current, setCurrent] = useState(0);
  const [prevNumber, setPrevNumber] = useState("");
  const [number, setNumber] = useState("");
  const mode = ["one", "two", "three"];

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => {
    const next = (current + 1) % mode.length;
    setCurrent(next);
    setTheme(mode[next]);
  };
  const maxLimit = 15;
  function Result() {
    if (number.length !== 0) {
      setPrevNumber(number);
      try {
        // Replace 'x' with '*' for calculation
        let expr = number.replace(/x/g, "*");
        let calResult = eval(expr);
        calResult = parseFloat(calResult.toFixed(3));
        setNumber(calResult.toString());
      } catch (error) {
        setNumber("Error");
        console.log(error);
      }
    } else {
      setNumber("");
    }
  }

  function isOperator(char) {
    return ["*", "/", "%", "+", "-", "x"].includes(char);
  }

  const handleButton = (value) => {
    if (value === "reset") {
      setNumber("");
      setPrevNumber("");
    } else if (value === "del") {
      setNumber((prev) => prev.slice(0, -1));
      if(number===""){
        setNumber(prevNumber)
        setPrevNumber("")
      }
    } else if (isOperator(value)) {
      if (number === "" || isOperator(number[number.length - 1])) return;
      setNumber((prev) => prev + value);
    } else if (value === ".") {
      // Only add one dot per number segment
      const lastOperatorIdx = Math.max(
        number.lastIndexOf("+"),
        number.lastIndexOf("-"),
        number.lastIndexOf("x"),
        number.lastIndexOf("/"),
        number.lastIndexOf("*"),
        number.lastIndexOf("%")
      );
      const lastSegment = number.slice(lastOperatorIdx + 1);
      if (lastSegment.includes(".")) return;
      if (number === "") {
        setNumber("0.");
      } else {
        setNumber((prev) => prev + ".");
      }
    } else if (value === "=") {
      Result();
    } else if (number.length >= maxLimit) {
      alert(`maximum characters allowed: ${maxLimit}`);
    } else {
      setNumber((prev) => prev + value);
    }
  };

  // Button configuration for mapping
  const buttons = [
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    {
      label: "DEL",
      value: "del",
      className: "bg-Navy-800 theme-two:bg-Blue-600 theme-three:bg-Purple-400",
      innerClass:
        "bg-Navy-700 theme-two:bg-Blue-500 theme-three:bg-Purple-800 text-white",
    },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "+", value: "+" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "-", value: "-" },
    { label: ".", value: "." },
    { label: "0", value: "0" },
    { label: "/", value: "/" },
    { label: "x", value: "x" },
    {
      label: "RESET",
      value: "reset",
      className:
        "col-span-2 bg-Navy-800 theme-two:bg-Blue-600 theme-three:bg-Purple-400",
      innerClass:
        "bg-Navy-700 theme-two:bg-Blue-500 theme-three:bg-Purple-800 text-white",
    },
    {
      label: "=",
      value: "=",
      className:
        "col-span-2 bg-Red-800 theme-two:bg-Orange-800 theme-three:bg-Cyan-400",
      innerClass:
        "bg-Red-600 theme-two:bg-Orange-700 theme-three:bg-Cyan-500 text-white theme-three:text-Blue-950",
    },
  ];

  return (
    <>
      <div className="bg-mainBg">
        <div className="p-5 h-screen max-w-[500px] mx-auto ">
          <div className="text-white theme-two:text-Gray-900 theme-three:text-Yellow-300 flex justify-between items-end">
            <h1 className="font-bold text-2xl sm:text-3xl">calc</h1>

            <div className="flex items-end gap-5">
              <span className=" font-bold text-sm">THEME</span>
              <button className="">
                <div className=" space-x-3">
                  <span onClick={() => setTheme(mode[0])}>1</span>
                  <span onClick={() => setTheme(mode[1])}>2</span>
                  <span onClick={() => setTheme(mode[2])}>3</span>
                </div>
                <div
                  onClick={toggle}
                  className={` flex ${
                    theme === "two"
                      ? "justify-center"
                      : theme === "three"
                      ? "justify-end"
                      : "justify-start"
                  } bg-keyPadBg w-full rounded-2xl p-0.5 sm:p-1`}
                >
                  <div className=" h-4 w-4 rounded-full bg-Red-600 theme-three:bg-Cyan-500 "></div>
                </div>
              </button>
            </div>
          </div>

          <div className="h-25 font-bold text-white theme-two:text-Gray-900 theme-three:text-Yellow-300  bg-screenBg mt-10 rounded-2xl flex flex-col items-end  px-6 ">
            <span className="h-8 ">{prevNumber}</span>
            <span className="text-4xl sm:text-5xl text-end w-full overflow-x-auto ">
              {number}
            </span>
          </div>

          <div className="bg-keyPadBg p-3 grid  grid-cols-4  rounded-2xl gap-2 my-5">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={() => handleButton(btn.value)}
                className={`h-14 text-2xl sm:text-3xl font-bold rounded-lg shadow-2xl pb-1 mb-2 sm:mb-4 ${
                  btn.className
                    ? btn.className
                    : "bg-Navy-800 theme-two:bg-Gray-orange-450 theme-three:bg-Purple-750"
                }`}
              >
                <div
                  className={`rounded-lg w-full h-full flex justify-center items-center ${
                    btn.innerClass
                      ? btn.innerClass
                      : "bg-Gray-200 theme-three:bg-Purple-850 text-Navy-750 theme-two:text-Gray-900 theme-three:text-Yellow-300"
                  }`}
                >
                  {btn.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
