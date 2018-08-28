import {Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, OnDestroy} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import {UserService} from '../user.service';
import {EventDto} from '../models/event';
import {EventDate} from '../models/eventDate';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  modalRef;
  i = 0;
  owner = false;
  userEvents = false;
  newEvent: CalendarEvent;
  view = 'month';
  viewDate: Date = new Date();
  // modalData: {
  //   action: string;
  //   event: CalendarEvent;
  //   num: number;
  // };
  modalData: {
    action: string;
    adTitle: string;
    eventTitle: string;
    eventStart: Date;
    eventEnd: Date;
    status: string;
    index: number;
  };
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event, 0);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event, 0);
      }
    }
  ];

  refresh: Subject<any> = new Subject();
  eventsDto: EventDto[] = [];
  eventAdded: boolean;
  events: CalendarEvent[] = [];
  //   {
  //     start: new Date('06/12/2018'),
  //     end: new Date('06/14/2018'),
  //     title: 'A 4 day event',
  //     color: colors.blue,
  //   },
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: 'An event with no end date',
  //     color: colors.yellow,
  //     actions: this.actions
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: 'A long event that spans 2 months',
  //     color: colors.blue
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: new Date(),
  //     title: 'A draggable and resizable event',
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   }
  // ];

  activeDayIsOpen = true;

  constructor(private modal: NgbModal,
              public snackBar: MatSnackBar,
              public userService: UserService,
              private router: Router) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event, 0);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent, index: number): void {
    const num = this.i++;
    console.log(index);
    // this.modalData = { event, action, num };
    const eventTitle = event.title;
    const eventStart = event.start;
    const eventEnd = event.end;
    const adTitle = this.eventsDto[index].adTitle;
    let status: string;
    if (this.eventsDto[index].status === 'ACCEPTED') {
      status = 'Programare acceptată';
    } else {
      status = 'În așteptare';
    }
    this.modalData = {action, adTitle, eventTitle, eventStart, eventEnd, index, status};
    this.modalRef = this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    // this.events.push({
    //   title: 'New event',
    //   start: startOfDay(new Date()),
    //   end: endOfDay(new Date()),
    //   color: colors.red,
    //   draggable: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   }
    // });
    // this.refresh.next();
    // const event: CalendarEvent = {
    this.eventAdded = true;
    this.newEvent = {
      title: '',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    };
    const newDtoEvent = new EventDto();
    newDtoEvent.message = this.newEvent.title;
    newDtoEvent.status = '';
    newDtoEvent.userEmail = this.userService.currentUser.email;
    newDtoEvent.adId = this.userService.adDetailsCalendar.id;
    newDtoEvent.startDate = this.newEvent.start.toLocaleString();
    newDtoEvent.endDate = this.newEvent.end.toLocaleString();
    this.eventsDto.push(newDtoEvent);
    this.events.push(this.newEvent);
    this.refresh.next();
    console.log(this.newEvent);
  }

  ngOnInit() {
    this.eventAdded = false;
    this.userService.userEvent = true;
    this.userService.eventsCalendar = [];
    if (this.userService.adDetailsCalendar) {
      this.userService.getAdEvents(this.userService.adDetailsCalendar.id).subscribe(
        result => {
          console.log(result);
          this.eventsDto = result;
          this.userService.eventsCalendar = result;
          this.eventsDto.forEach(
            eventDto => {
              const event: CalendarEvent = {
                title: eventDto.message,
                start: startOfDay(new Date()),
                end: endOfDay(new Date()),
                color: colors.red,
                draggable: false,
                resizable: {
                  beforeStart: true,
                  afterEnd: true
                }
              };
              event.start = new Date(eventDto.startDate);
              event.end = new Date(eventDto.endDate);
              console.log(event);
              this.events.push(event);
              this.refresh.next();
            }
          );
          if (this.userService.currentUser.token) {
            this.userService.eventsCalendar.forEach(
              event => {
                if (event.userEmail === this.userService.currentUser.email) {
                  this.userService.userEvent = false;
                }
              }
            );
          }
        }
      );
    } else {
      this.userService.getUserEvents().subscribe(
        response => {
          this.userEvents = true;
          console.log(response);
          this.eventsDto = response;
          this.userService.eventsCalendar = response;
          this.eventsDto.forEach(
            eventDto => {
              if (eventDto.owner) {
                this.owner = true;
                this.userEvents = false;
              }
              const event: CalendarEvent = {
                title: eventDto.message,
                start: startOfDay(new Date()),
                end: endOfDay(new Date()),
                color: colors.red,
                draggable: false,
                resizable: {
                  beforeStart: true,
                  afterEnd: true
                }
              };
              event.start = new Date(eventDto.startDate);
              event.end = new Date(eventDto.endDate);
              console.log(event);
              this.events.push(event);
              this.refresh.next();
            }
          );
          if (this.userService.currentUser.token) {
            this.userService.eventsCalendar.forEach(
              event => {
                if (event.userEmail === this.userService.currentUser.email) {
                  console.log(event.userEmail + ' ' + this.userService.currentUser.email);
                  this.userService.userEvent = false;
                }
              }
            );
          }
        }
      );
    }
  }

  closeModal() {
    this.modalRef.close(true);
  }

  sendAppointment(index: number) {
    console.log(this.events);
    console.log(this.events[index]);
    for (let i = 0; i < this.events.length; i++) {
      if (i !== index && this.events[index].start.getDay() === this.events[i].start.getDay()
        && ((this.events[index].end >= this.events[i].start && this.events[index].end <= this.events[i].end)
        || (this.events[index].start >= this.events[i].start && this.events[index].start <= this.events[i].end)
        || (this.events[index].start >= this.events[i].start && this.events[index].end <= this.events[i].end)
        || (this.events[index].start <= this.events[i].start && this.events[index].end >= this.events[i].end))) {
        this.snackBar.open('Intervalul orar nu este disponibil pentru programare!', 'Ok', {duration: 5000});
        return;
      }
    }
    if (this.events[index].start.getTime() >= this.events[index].end.getTime()) {
      this.snackBar.open('Datele de inceput si sfarsit nu sunt corecte!', 'OK', {duration: 5000});
    } else {
      this.userService.userEvent = false;
      this.eventsDto[index].status = 'PENDING';
      const eventDto = new EventDate();
      eventDto.message = this.events[index].title;
      eventDto.startDate = this.events[index].start.toLocaleString();
      eventDto.endDate = this.events[index].end.toLocaleString();
      eventDto.status = 'PENDING';
      eventDto.userEmail = this.userService.currentUser.email;
      eventDto.adId = this.userService.adDetailsCalendar.id;
      this.userService.userEvent = false;
      this.userService.saveEvent(eventDto).subscribe(
        response => console.log(response)
      );
    }
  }

  deleteAppointment(index) {
    this.userService.userEvent = true;
    const eventDto = new EventDate();
    eventDto.message = this.events[index].title;
    eventDto.startDate = this.events[index].start.toLocaleString();
    eventDto.endDate = this.events[index].end.toLocaleString();
    eventDto.status = '';
    if (!this.eventsDto[index].eventId) {
      eventDto.userEmail = this.userService.currentUser.email;
    } else {
      eventDto.userEmail = this.eventsDto[index].userEmail;
    }
    if (this.userService.adDetailsCalendar) {
      eventDto.adId = this.userService.adDetailsCalendar.id;
    } else {
      eventDto.adId = this.eventsDto[index].adId;
    }
    this.userService.deleteEvent(eventDto).subscribe(
      result => console.log(result)
    );
    this.events.splice(index, 1);
    this.eventsDto.splice(index, 1);
    this.refresh.next();
  }

  confirmAppointment(index) {
    this.userService.userEvent = false;
    const eventDto = new EventDate();
    eventDto.message = this.events[index].title;
    eventDto.startDate = this.events[index].start.toLocaleString();
    eventDto.endDate = this.events[index].end.toLocaleString();
    eventDto.status = 'ACCEPTED';
    eventDto.userEmail = this.eventsDto[index].userEmail;
    // eventDto.adId = this.userService.adDetailsCalendar.id;
    eventDto.adId = this.eventsDto[index].adId;
    this.userService.updateEvent(eventDto).subscribe(
      result => console.log(result)
    );
    this.eventsDto[index].status = eventDto.status;
  }

  ngOnDestroy(): void {
    this.userService.adDetailsCalendar = null;
  }

  adDetails(index: number) {
    this.router.navigate(['/AdDetails', this.eventsDto[index].adId]);
  }
}
