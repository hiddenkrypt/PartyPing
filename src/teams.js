module.exports = function(settings){
  return {
    north: {
      layers:[20, 80, 120],
      concessions:0,
      players: [],
      startLayer: 0
    },
    south: {
      layers:[settings.gamefield.height-120, settings.gamefield.height-80,settings.gamefield.height-20],
      concessions:0,
      players: [],
      startLayer: 2
    }
  };
};
