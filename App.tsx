
import React from 'react';
import {Header, Wrapper} from "./components";
import {Recorder} from "./components/Recorder";
import {Player} from "./components/Player";

export default function App() {
    const [ audioUri, setAudioUri ] = React.useState<string>('')

      return (
          <Wrapper>
              <>
                  <Header />
                  <Recorder onFinishRecording={setAudioUri} />
                  {audioUri.length > 0 && <Player uri={audioUri} />}
              </>
          </Wrapper>
      )
}
