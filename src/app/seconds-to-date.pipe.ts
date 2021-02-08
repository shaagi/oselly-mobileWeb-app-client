import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';
import 'moment-timezone';

@Pipe({name: 'secondsToDate'})

export class SecondsToDatePipe implements PipeTransform {
  transform(seconds: number) {
    let momentObj = moment.unix(seconds);
    let date = moment(momentObj).tz('America/Toronto').format("ddd, MMM Do");
    return date;
  }
}
