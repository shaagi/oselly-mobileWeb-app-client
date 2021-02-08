import {Pipe, PipeTransform} from '@angular/core';
// import moment from 'moment';
import moment from 'moment';
import 'moment-timezone';

@Pipe({name: 'secondsToTime'})

export class SecondsToTimePipe implements PipeTransform {
  transform(seconds: number) {
    let momentObj = moment.unix(seconds);
    let time = moment(momentObj).tz('America/Toronto').format("h:mmA");
    return time;
  }
}
