import React, { useState } from "react";
import "../styles/Counter.css";

const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  return (
    <div className="counter-container">
      <div className="counter-box">
        <h1>Counter App</h1>
        <h2 className="counter-value">{count}</h2>
        <div className="button-group">
          <button onClick={increment}>Increment</button>
          <button onClick={decrement}>Decrement</button>
        </div>
      </div>
    </div>
  );
};

export default Counter;
