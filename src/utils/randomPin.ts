function randomPin() {
  const min: number = 100000;
  const max: number = 999999;
  return Math.round(Math.random() * (max - min) + min);
  // not unique pin, 2 room can have same pin
}
export default randomPin;
