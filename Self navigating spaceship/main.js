const shipCanvas=document.getElementById("shipCanvas");
shipCanvas.width=300;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const shipCtx = shipCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road=new Road(shipCanvas.width/2,shipCanvas.width*0.9);

const N=400;
const ships=generateships(N);
let bestship=ships[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<ships.length;i++){
        ships[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(ships[i].brain,0.1);
        }
    }
}

const traffic=[
    new asteroid(road.getLaneCenter(1),-150,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(0),-350,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(2),-350,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(0),-550,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(1),-550,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(1),-750,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(2),-750,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(0),-850,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(1),-900,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(2),-1050,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(0),-1100,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(0),-1200,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(1),-1200,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(0),-1400,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(1),-1400,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(2),-1400,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(0),-1500,30,50,"DUMMY",2),
    new asteroid(road.getLaneCenter(2),-1500,30,50,"DUMMY",2),



];

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestship.brain));
}

function disshipd(){
    localStorage.removeItem("bestBrain");
}

function generateships(N){
    const ships=[];
    for(let i=1;i<=N;i++){
        ships.push(new ship(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return ships;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<ships.length;i++){
        ships[i].update(road.borders,traffic);
    }
    bestship=ships.find(
        c=>c.y==Math.min(
            ...ships.map(c=>c.y)
        ));

    shipCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    shipCtx.save();
    shipCtx.translate(0,-bestship.y+shipCanvas.height*0.7);

    road.draw(shipCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(shipCtx);
    }
    shipCtx.globalAlpha=0.2;
    for(let i=0;i<ships.length;i++){
        ships[i].draw(shipCtx);
    }
    shipCtx.globalAlpha=1;
    bestship.draw(shipCtx,true);

    shipCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestship.brain);
    requestAnimationFrame(animate);
}