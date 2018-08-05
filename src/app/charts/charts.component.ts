import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {UserService} from '../user.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  public barChartLegend = true;
  public barChartType = 'bar';
  public barChartLabels: string[] = ['Apartamente', 'Case', 'Vanzare/Cumparare', 'Inchiriere'];
  public barChartData: any[] = [
      {data: [65], label: this.barChartLabels[0]},
      {data: [28], label: this.barChartLabels[1]},
      {data: [48], label: this.barChartLabels[2]},
      {data: [78], label: this.barChartLabels[3]}
  ];
  public doughnutChartLabels: string[] = ['Programari', 'Programari acceptate', 'Programari in asteptare'];
  public doughnutChartData: number[] = [];
  public doughnutChartType = 'doughnut';
  public doughnutChartOptions: any = {
    responsive: true,
    cutoutPercentage: 65
  };
  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          // steps : 15,
          stepValue : 1,
          max : 15,
          beginAtZero: true,
        },
        display: true,
      }],
      xAxes: [{
        display: true,
        gridLines: {
          color: 'rgba(0, 0, 0, 0)'
        }
      }]
    }
  };
  public doughnutChartColors: Array<any> = [
    { // primary
      backgroundColor: ['rgba(102,204,255,1)', 'rgba(255,255,102,1)', 'rgba(255,0,0,1)'],
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public barChartColors: Array<any> = [
    { // primary
      backgroundColor: ['rgba(102,204,255,1)'],
      pointHoverBackgroundColor: '#fff'
    },
    {
      backgroundColor: ['rgba(255,255,102,1)'],
      pointHoverBackgroundColor: '#fff'
    },
    {
      backgroundColor: ['rgba(255,0,0,1)'],
      pointHoverBackgroundColor: '#fff'
    },
    {
      backgroundColor: ['rgba(255,0,0,1)'],
      pointHoverBackgroundColor: '#fff'
    }
  ];

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.getEventsReport().subscribe(
      result => {
        console.log(result);
        this.doughnutChartData = [result.allEvents, result.acceptedEvents, result.pendingEvents];
        this.barChartData = [
          {data: [result.apartmentAds], labels: this.barChartLabels[0]},
          {data: [result.homeAds], labels: this.barChartLabels[1]},
          {data: [result.salesAds], labels: this.barChartLabels[2]},
          {data: [result.rentAds], labels: this.barChartLabels[3]}
        ];
        console.log(this.barChartData);
      }
    );
  }
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
