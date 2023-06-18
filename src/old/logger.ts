// import chalk from 'chalk';
// import { log } from 'console';
// import { createWriteStream } from 'fs';
// import moment, { Moment } from 'moment';
// import ora from 'ora-classic';

// type loggerType = 'warning' | 'error' | 'info'


// export class Logger {
//   constructor() {
//     const path = `logs/${moment().format()}.log`
//     this.fileStream = createWriteStream(path, {})
//     this.timer = moment()
//     this.currentSpinner = ora({
//       prefixText: '  ',
//       spinner: 'dots8Bit',
//       stream: this.fileStream
//     });
//   }

//   new = async (text: string) => {
//     this.currentSpinner.text = text
//     // log(text);
//     this.lastText = text
//     this.timer = moment();
//     return this.currentSpinner.start();
//   }
//   concludes = (text = this.lastText, status: 'succeed' | 'fail' = 'succeed') => {
//     // log(text);
//     return this.currentSpinner[status](`${text} (${(moment().diff(this.timer, 'seconds', true) * 1000).toFixed()}ms)`)
//   }
//   info = (text: string) => {
//     // log(text);
//     this.currentSpinner.info(text);
//   }
//   log = (text: string, type: loggerType = 'info') => {

//     // this.fileStream.write(`[${moment().format()}] ${type.substring(0, 4)}: ${text}\n`)

//     // return ora({ text, spinner: 'dots8Bit', stream: this.fileStream })


//     // let fn;

//     // if (type === 'warning')
//     //   fn = chalk.hex('#FFA500')
//     // else if (type === 'error')
//     //   fn = chalk.bold.bgRed
//     // else
//     //   fn = chalk.white

//     // log(fn(message))
//   }

//   private fileStream
//   private currentSpinner;
//   private timer;
//   private lastText: undefined | string;
// }

// const logger = new Logger()

// export default logger

// import ora, { Ora } from "ora-classic"
// import moment, { Moment } from "moment"
// import { createWriteStream } from 'fs';

// let currentSpinner: Ora;
// let timer: Moment | undefined;
// let lastText: string | undefined;
// const stream = createWriteStream(`logs/${moment().format()}.log`, {})

// const spinner = {
//   new: async (text: string) => {
//     currentSpinner = ora({
//       text: text,
//       prefixText: '  ',
//       spinner: 'dots8Bit',
//       stream
//     });
//     lastText = text;
//     timer = moment();
//     return currentSpinner.start();
//   },
//   concludes: (text = lastText, status: 'succeed' | 'fail' = 'succeed') => {
//     return currentSpinner[status](`${text} (${(moment().diff(timer, 'seconds', true) * 1000).toFixed()}ms)`)
//   },
//   info: (text: string) => {
//     spinner.new('');
//     currentSpinner.info(text);
//   }
// }

// export default spinner