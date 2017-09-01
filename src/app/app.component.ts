// Welcome to my code demo!
// This is a TypeScript file from an Angular4 app I created using Angular CLI.
// You can view the entire code-demo project on my GitHub. The link is listed below.
// This demo uses HTML, CSS, and TypeScript to demo my abilities as a dev.
// For demo purposes this file is structured a little differently than a normal project.
// HTML, CSS, and TypeScript are all in the same file.
// Using the app component as the only component in the project, etc.

// The actual demo is a pretty fun little  app I made about The Office.
// Check it out if you have the time!
// https://github.com/tripstar22/code-demo

import { Component, OnInit } from '@angular/core';
// import AngularFire2 to access Firebase data
// https://github.com/angular/angularfire2
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
// import d3 chart library
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  template: `
    <section id="hero">
      <video autoplay loop>
        <source src="https://res.cloudinary.com/tripstar/video/upload/v1504202783/theoffice_cmamni.mp4" type="video/mp4">
        Your browser does not support the video tag. 
      </video>
      <div class="wrapScrollIndicator">
        <img src="https://res.cloudinary.com/tripstar/image/upload/v1501592883/arrow_down_white_pfixjq.svg" alt="scroll down" />
      </div>
    </section>
    <main>
      <div class="wrapHeading">
        <h1>Characters</h1>
      </div>
      <section>
        <ul class="wrapFlex">
          <li *ngFor="let item of items | async" class="itemFlex">
            <md-card>
              <div class="containerCard">
                <img src="{{item.img}}" alt="{{item.name}}" />
                <md-card-title>{{item.name}}</md-card-title>
                <md-card-content><span>Quote&#58;</span> {{item.quote}}</md-card-content>
              </div>
            </md-card>
          </li>
        </ul>
      </section>
      <section>
        <div class="wrapHeading">
          <h2>Viewers</h2>
        </div>
        <div id="wrapGraph"></div>
      </section>
    </main>
  `,
  styles: [`
    section {
      width: 100%; 
    }
    #hero { 
      position: relative;
    }
    video {
      width: 100%;
      height: auto;
      display: block;
      background-size: cover;
      position: relative;
      top: 0;
      left: 50%;
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      transform: translateX(-50%);
    }
    .logo {
      width: 150px;
      position: absolute;
      top: 100px;
      left: 50%;
      z-index: 1;
      margin-left: -75px;
    }
    main {
      width: 100%;
    }
    .wrapFlex {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      align-items: stretch;
      justify-content: center;
      margin: 0 auto;
    }
    .itemFlex {
      width: 90%;
      order: 1;
      flex: 0 1 auto;
      padding: 0 10px;
      margin-bottom: 40px;
    }
    .containerCard {
      width: 90%;
      display: block;
      margin: 0 auto;
    }
    md-card {
      min-height: 100%;
    }
    md-card img {
      width: 100%;
      padding-bottom: 30px;
    }
    md-card-content span {
      font-weight: bold;
    }
    .wrapHeading {
      text-align: center;
    }
    h1, h2 {
      font-family: 'Roboto Mono', monospace;
      font-size: 1.5em;
      font-weight: 400;
      padding: 40px 0 30px; 
    }
    #wrapGraph {
      width: 90%;
      height: 100%;
      min-height: 500px;
      padding-bottom: 80px;
      margin: 0 auto;
    }
    .wrapScrollIndicator {
      display: none;
    }
    @media (min-width: 768px) {
      .logo {
        width: 200px;
        top: 150px;
        margin-left: -100px;
      }
      .itemFlex {
        width: 30%;
      }
    }
    @media (min-width: 1024px) {
      .logo {
        width: 270px;
        top: 200px;
        margin-left: -135px;
      }
      .wrapScrollIndicator {
        width: 50px;
        display: block;
        position: absolute;
        bottom: 75px;
        left: 50%;
        -webkit-transform: translateX(-25px);
        -moz-transform: translateX(-25px);
        transform: translateX(-25px);
      }
      .wrapScrollIndicator img {
        -webkit-animation: aniScroll 1.5s infinite;
        -moz-animation: aniScroll 1.5s infinite;
        animation: aniScroll 1.5s infinite;
      }
    }
    @media (min-width: 1200px) {
      .wrapFlex {
        width: 90%;
      }
    }
    // animate scroll indicator
    @-webkit-keyframes aniScroll {
      0%, 20%, 50%, 80%, 100% {
          -webkit-transform: translateY(0);
      }
      40% {
          -webkit-transform: translateY(-30px);
        }
      60% {
          -webkit-transform: translateY(-15px);
        }
    }
    @-moz-keyframes aniScroll {
      0%, 20%, 50%, 80%, 100% {
          -moz-transform: translateY(0);
      }
      40% {
          -moz-transform: translateY(-30px);
        }
      60% {
          -moz-transform: translateY(-15px);
        }
    }
    @keyframes aniScroll {
      0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
      }
      40% {
          transform: translateY(-30px);
        }
      60% {
          transform: translateY(-15px);
        }
    }
  `]
})
export class AppComponent implements OnInit  {
  
  // data is in Google Sheet
  // every time Google Sheet changes
  // a script runs and pushes update to Firebase
  items: FirebaseListObservable<any[]>;

  // get Firebase data
  // data populates character section of app
  // see <ul class="wrapFlex"> in HTML
  constructor(db: AngularFireDatabase) {
		this.items = db.list('/items');
  }

  // d3 graph for avg viewers per season
  // data coming from json file in app
  // see <div id="wrapGraph"></div> in HTML
  graphViewers() {
		// create var for graph wrap
		const wrap = document.getElementById('wrapGraph');
		// set up graph area
		const margin = {top: 20, right: 20, bottom: 30, left: 40},
    		width = wrap.clientWidth - margin.left - margin.right,
    		height = wrap.clientHeight - margin.top - margin.bottom;

		// append the svg object to the body of the page
		// append a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		const svg = d3.select(wrap).append("svg")
		    .attr("width", "100%")
		    .attr("height", "100%")
		  .append("g")
		    .attr("transform",
		          "translate(" + margin.left + "," + margin.top + ")");

		// set the ranges
		let x = d3.scaleBand().range([0, width]).padding(0.1);
		let y = d3.scaleLinear().range([height, 0]);

		d3.json<any[]>('../assets/data/viewers.json', function(error, data) {
			if (error) throw error;
			// format data
			data.forEach(function(d) {
				let season = d.season;
				let viewers = d.viewers;
			});

      // Scale the range of the data in the domains
      x.domain(data.map(function(d) { return d.season; }));
      y.domain([0, d3.max(data, function(d) { return d.viewers; })]);

      // append the rectangles for the bar chart
      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.season); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.viewers); })
          .attr("height", function(d) { return height - y(d.viewers); });

      // add the x Axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
      // text label for the x axis
      svg.append("text")             
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Season");
      // add the y Axis
      svg.append("g")
        .call(d3.axisLeft(y));
      // text label for the y axis
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("U.S. Viewers (million)");

			// create var for window
			const w = window;
			// add event listener for window resize
			w.addEventListener('resize', function(event) {
				// set up graph area
				let margin = {top: 20, right: 20, bottom: 30, left: 40},
					width = wrap.clientWidth - margin.left - margin.right,
					height = wrap.clientHeight - margin.top - margin.bottom;
        // Scale the range of the data in the domains
        x.domain(data.map(function(d) { return d.season; }));
        y.domain([0, d3.max(data, function(d) { return d.viewers; })]);
      });
		});
	}
  
  ngOnInit() {
    this.graphViewers();
  }
}
