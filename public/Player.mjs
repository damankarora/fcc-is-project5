class Player {
  constructor({x, y, score, id}) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
  }

  movePlayer(dir, speed) {
    switch(dir){
      case "up": 
        this.y += speed;
        break;
      case "down":
        this.y -= speed;
        break;
      case "left":
        this.x -= speed;
        break;
      case "right":
        this.x += speed;
        break;
      default:
        throw new Error("Invalid direction")
    }
  }

  collision(item) {
    return this.x === item.x && this.y === item.y;
  }

  calculateRank(arr) {
    let rank = 1;
    for(let player of arr){
      // If encounter himself.
      if(player.id == this.id){
        continue;
      }
      if(player.score > this.score){
        rank += 1;
      }
    }

    return `Rank: ${rank}/${arr.length}`;
  }
}

export default Player;
