import Home from './Home';

const App = () => {
  let text = 'Hello world!';
  const updateText = () => {
    text = 'Hello world! Updated';
    console.log(text);
  };
  return (
    <>
      <h1 onClick={updateText}>{text}</h1>
      <Home />
    </>
  );
};

export default App;
