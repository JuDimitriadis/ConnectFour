(function () {
    var currentPlayer = "player1";
    var bombBig = $("#bombBig");
    var flagBig = $("#flagBig");
    var indexWinner = 0;
    var current;

    $(".restart").on("click", function () {
        clean();
    });

    function selectPlayer() {
        if (currentPlayer === "player1") {
            currentPlayer = "player2";
            turn();
        } else {
            currentPlayer = "player1";
            turn();
        }
    }

    function turn() {
        if (currentPlayer === "player1") {
            $("#flag").removeClass("onScreen");
            $("#bomb").addClass("onScreen");
        } else if (currentPlayer === "player2") {
            $("#bomb").removeClass("onScreen");
            $("#flag").addClass("onScreen");
        }
    }

    function clean() {
        var slotsToClean = $(".slot");
        for (var i = 0; i < slotsToClean.length; i++) {
            if (slotsToClean.eq(i).hasClass("player1")) {
                slotsToClean.eq(i).removeClass("player1");
            } else if (slotsToClean.eq(i).hasClass("player2")) {
                slotsToClean.eq(i).removeClass("player2");
            }
        }
    }

    function winnerS(parent, winnerArray) {
        clean();

        if (indexWinner === 4) {
            for (var i = 0; i < winnerArray.length; i++) {
                parent.eq(winnerArray[i]).addClass(current);
            }
            indexWinner = 0;
            console.log("maior4", indexWinner);
            return;
        } else if (indexWinner < winnerArray.length) {
            parent.eq(winnerArray[indexWinner]).addClass(current);
            indexWinner++;
            console.log("menor", indexWinner);
            setTimeout(function () {
                winnerS(parent, winnerArray);
            }, 500);
        }
    }

    $(".col").on("click", function (evt) {
        var column = $(evt.currentTarget);
        var slotsCol = $(evt.currentTarget).children();

        for (var i = 0; i < 6; i++) {
            if (
                !slotsCol.eq(i).hasClass("player1") &&
                !slotsCol.eq(i).hasClass("player2")
            ) {
                slotsCol.eq(i).addClass(currentPlayer);
                checkWinner(slotsCol);
                checkWinner($(".slot:nth-child(" + (i + 1) + ")"));
                checkWinnerX(column.index(), i);
                selectPlayer();
                break;
            }
        }
    });

    function checkWinner(slots) {
        var count = 0;
        var vH = [];

        for (var i = 0; i < slots.length; i++) {
            if ($(slots[i]).hasClass(currentPlayer)) {
                count++;
                vH.push(i);
                if (count === 4) {
                    selectingWinner();
                    winnerS(slots, vH);

                    console.log("winner VH");
                    return;
                }
            } else {
                count = 0;
                vH = [];
            }
        }
    }

    function checkWinnerX(columnIdx, rowIdx) {
        var slt = $(".slot");
        var sum = columnIdx + rowIdx;
        var sub = columnIdx - rowIdx;
        var x1 = [];
        var x2 = [];

        for (var i = 0; i < slt.length; i++) {
            var colI = slt.eq(i).parent().index();
            var rowI = slt.eq(i).index();
            var sumI = colI + rowI;
            var subI = colI - rowI;

            if (sum === sumI) {
                if (slt.eq(i).hasClass(currentPlayer)) {
                    x1.push(i);
                    if (x1.length === 4) {
                        selectingWinner();
                        winnerS(slt, x1);

                        console.log("winner", x1);
                    }
                } else {
                    x1 = [];
                }
            }
            if (sub === subI) {
                if (slt.eq(i).hasClass(currentPlayer)) {
                    x2.push(i);
                    if (x2.length === 4) {
                        selectingWinner();
                        winnerS(slt, x2);

                        console.log("winner 2", x2);
                    }
                } else {
                    x2 = [];
                }
            }
        }
    }

    function selectingWinner() {
        current = currentPlayer;
        if (currentPlayer === "player1") {
            $("#shadow").addClass("on");
            $("#winnerBar1").addClass("on");
            blinkingBomb();
        } else if (currentPlayer === "player2") {
            $("#shadow").addClass("on");
            $("#winnerBar2").addClass("on");
            blikingFlag();
        }

        function blinkingBomb() {
            bombBig.css({
                opacity: 1,
                transition: "opacity 1.5s ease-in-out",
            });

            setTimeout(function () {
                bombBig.css({
                    opacity: 0,
                    transition: "opacity 1.5s ease-in-out",
                });
            }, 1500);
        }
        var bombInterval = setInterval(function () {
            blinkingBomb(), 1000;
        }, 3000);

        function blikingFlag() {
            flagBig.css({
                opacity: 1,
                transition: "opacity 1.5s ease-in-out",
            });

            setTimeout(function () {
                flagBig.css({
                    opacity: 0,
                    transition: "opacity 1.5s ease-in-out",
                });
            }, 1500);
        }
        var flagInterval = setInterval(function () {
            blikingFlag(), 1000;
        }, 3000);

        $("#shadow").on("click", function () {
            clearInterval(bombInterval);
            clearInterval(flagInterval);
            $("#shadow").removeClass("on");
            $("#winnerBar1").removeClass("on");
            $("#winnerBar2").removeClass("on");
            clean();
        });
    }
})();