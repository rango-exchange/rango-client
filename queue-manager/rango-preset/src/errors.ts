export class RangoPresetError extends Error {
  name = 'RangoPresetError';

  constructor(msg: string) {
    super(msg);
  }
}
