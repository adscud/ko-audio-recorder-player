
import React from 'react';
import {Header, Wrapper} from "./components";
import {Recorder} from "./components/Recorder";

export default function App() {
    const [ audioUri, setAudioUri ] = React.useState<string>('')

      return (
          <Wrapper>
              <>
                  <Header />
                  <Recorder onFinishRecording={setAudioUri} />
              </>
          </Wrapper>
      )
}
