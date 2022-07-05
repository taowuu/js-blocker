var imgFromPath = function(path) {
    var img = new Image()
    img.src = path
    return img
}

var Paddle = function() {
    var img = imgFromPath('paddle.png')
    var p = {
        img: img,
        x: 100,
        y: 250,
        speed: 5,
    }
    p.moveLeft = function () {
        p.x -= p.speed
    }
    p.moveRight = function () {
        p.x += p.speed
    }
    var aInb = function(x, x1, x2) {
        return x >= x1 && x <= x2
    }
    p.collide = function(ball) {
        if (ball.y + ball.img.height > p.y) {
            if (ball.x + ball.img.width > p.x && ball.x < p.x + p.img.width) {
                log('相撞')
                return true
            }
        }
        // var a = p
        // var b = ball
        // if (aInb(a.x, b.x, b.x + b.w) || aInb(b.x, a.x, a.x + a.w)) {
        //     if (aInb(a.y, b.y, b.y + b.h) || aInb(b.y, a.y, a.y + a.h)) {
        //         log('相撞')
        //         return true
        //     }
        // }
        return false
    }
    return p
}

var Ball = function() {
    img = imgFromPath('ball.png')
    img.width = '30px'
    var b = {
        img: img,
        x: 100,
        y: 150,
        speedX: 5,
        speedY: 5,
        fired: false,
    }
    b.fire = function () {
        b.fired = true
    }
    b.move = function() {
        if (b.fired) {
            if (b.x < 0 || b.x > 400) {
                b.speedX = -b.speedX
            }
            if (b.y < 0 || b.y > 300) {
                b.speedY = -b.speedY
            }
            b.x += b.speedX
            b.y += b.speedY
        }
    }
    return b
}

var Game = function () {
    var g = {
        actions: {},
        keydowns: {},
    }
    //
    var canvas = document.querySelector('#id-canvas')
    var context = canvas.getContext('2d')
    context.strokeStyle = 'red'; // 设置线条的颜色
    context.stroke(); // 描边
    g.canvas = canvas
    g.context = context
    //
    g.drawImg = function (img) {
        g.context.drawImage(img.img, img.x, img.y)
    }
    window.addEventListener('keydown', function (event) {
        g.keydowns[event.key] = true
    })
    window.addEventListener('keyup', function (event) {
        g.keydowns[event.key] = false
    })
    //
    g.registerAction = function (key, callback) {
        g.actions[key] = callback
    }
    setInterval(function () {
        var actions = Object.keys(g.actions)
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i]
            if(g.keydowns[key]) {
                g.actions[key]()
            }
        }
        //
        g.update()
        //
        context.clearRect(0, 0, canvas.width, canvas.height)
        //
        g.draw()
    }, 1000/60)
    //
    return g
}

var __main = function () {
    var game = Game()
    //
    var paddle = Paddle()
    var ball = Ball()
    //
    game.registerAction('a', function(){
        paddle.moveLeft()
    })
    game.registerAction('d', function(){
        paddle.moveRight()
    })
    game.registerAction('f', function(){
        ball.fire()
    })
    //
    game.update = function () {
        ball.move()
        //
        if (paddle.collide(ball)) {
            ball.speedY *= -1
        }
    }
    game.draw = function () {
        game.drawImg(paddle)
        game.drawImg(ball)
    }
}

__main()
