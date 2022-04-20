function formatTimeFormat(timeFormat) {
  return timeFormat.split("|").join(" + ");
}

export default function CreateGameButton({ timeFormat }) {
  function handleClick(e) {
    console.log(timeFormat);
  }
  return <button onClick={handleClick}>{formatTimeFormat(timeFormat)}</button>;
}
