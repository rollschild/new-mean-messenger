import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';

// Asynchronous validator
// A normal synchronous validator would just
// ...return a normal JavaScript object
// ...returns null if validate
export const mimeType = (
  control: AbstractControl
): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (!control.value || typeof control.value === 'string') {
    return of(null);
    // of is a quick way to create observable
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  // Here we need to return either Promise
  // ...or Observable
  // fileReader.onloadend = () => {};
  const fileReadObs = Observable.create(
    (observer: Observer<{ [key: string]: any }>) => {
      fileReader.addEventListener('loadend', () => {
        const arr = new Uint8Array(<ArrayBuffer>fileReader.result).subarray(
          0,
          4
        );
        let header = '';
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
          // to Hex
        }
        switch (header) {
          case '89504e47':
            isValid = true;
            break;
          case 'ffd8ffe0':
          case 'ffd8ffe1':
          case 'ffd8ffe2':
          case 'ffd8ffe3':
          case 'ffd8ffe8':
            isValid = true;
            break;
          default:
            isValid = false;
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return fileReadObs;
};
