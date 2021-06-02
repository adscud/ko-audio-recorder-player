
import React from 'react';
import {Header, Wrapper} from "./components";
import {Recorder} from "./components/Recorder";

export default function App() {
  return (
      <Wrapper>
        <Header />
        <Recorder />
      </Wrapper>
  );
}
