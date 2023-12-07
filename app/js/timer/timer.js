function getTimer(time) {
    const total = Date.parse(time) - Date.parse(new Date());
    days = Math.floor(total / (1000 * 60 * 60 * 24));
    hours = Math.floor(total / (1000 * 60 * 60) % 24);
    minutes = Math.floor(total / (1000 * 60) % 60);
    seconds = Math.floor((total / 1000) % 60);
    return {
        days, hours, minutes, seconds, total
    };
}

function initialized(class, time){
    
}