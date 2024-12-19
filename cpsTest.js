cpsTestBtn = document.getElementById("cpsTestBtn");
resetBtn = document.getElementById("resetCpsTest");

startTime = null;
clicks = 0

function updateCps() {
    dTime = (Date.now() - startTime) / 1000;
    cps = Math.round(clicks / dTime * 100) /100
    document.getElementById("cpsDisplayer").innerHTML = cps;
    document.getElementById("clicks").innerHTML = clicks;
}

$(document).ready(function () {
    $(".cpsTestBtn").click(function () {
        clicks++;
        console.log("clicked");
        if (startTime == null) {
            startTime = Date.now();
            asyncWait(20, 200, updateCps);
        }
    });
});

if(resetBtn){
    resetBtn.onclick = function () {
        clicks = 0;
        cps = 0;
        startTime = null;
        document.getElementById("cpsDisplayer").innerHTML = 0;
        document.getElementById("clicks").innerHTML = clicks;
    }
}

async function asyncWait(time, times, func, args=null) {
    for (i = 0; i < times; i++) {

        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("Success"), time)
        });

        let result = await promise;
        if(args){
            func(args[0])
        }else{
            func();
        }
    }
}
