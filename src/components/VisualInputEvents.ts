export const onKeyDownVisualInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let dX = 0,
        dY = 0;
  
    switch (e.key) {
      case 'ArrowLeft':
        dX = -1;
        break;
      case 'ArrowRight':
        dX = 1;
        break;
      case 'ArrowUp':
        dY = -1;
        break;
      case 'ArrowDown':
        dY = 1;
        break;
      default:
        return; 
    }
  
    /* Only move x-y when in start or end in the text */
    
    const cursor = (e.target as HTMLInputElement).selectionStart || 0;
    const textLength = (e.target as HTMLInputElement).value.length;
    if (e.key === 'ArrowLeft' && cursor > 0) {
      // Do not go left if cursor is not at the begining
      return;
    }
    if (e.key === 'ArrowRight' && cursor != textLength) {
      // Do not go right if cursor is not at the end
      return;
    }
    const [ name, xString, yString ] = (e.target as HTMLInputElement).getAttribute('id')!.split('-');
    const x = parseInt(xString);
    const y = parseInt(yString);
    const nextX = (x + dX) % 3;
    const nextY = y + dY;
    const elementExists = document.getElementById(`input-${nextX}-${nextY}`);
    if (elementExists) {
      elementExists.focus();
      e.stopPropagation();
      e.preventDefault();
    }
  
  }
  