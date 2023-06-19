import { createWriteStream } from 'fs';
import moment from 'moment';
import ora from 'ora-classic';

const stream = createWriteStream(`logs/${moment().format()}.log`)

const log = (text: string, options?: ora.Options) => {
  stream.write(`${moment()}: ${text}\n`)
  return ora({ text, ...options }).start()
}

export default log