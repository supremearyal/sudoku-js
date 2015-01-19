(function() {
    var createCell = function(row, col) {
        var textInput = document.createElement('input');
        textInput.id = '' + (row * 9 + col);
        textInput.type = 'text';
        textInput.style.width = '50px';
        textInput.style.height = '50px';
        textInput.style['font-size'] = '30px';
        textInput.style['text-align'] = 'center';
        textInput.style.outline = 'none';

        textInput.style['border-style'] = 'solid';

        if (col == 0) {
            textInput.style['border-left-width'] = '1px';
        } else {
            textInput.style['border-left-width'] = '0px';
        }

        if ((col + 1) % 3 == 0 && (col + 1) != 9) {
            textInput.style['border-right-width'] = '2px';
        } else {
            textInput.style['border-right-width'] = '1px';
        }

        if (row == 0) {
            textInput.style['border-top-width'] = '1px';
        } else {
            textInput.style['border-top-width'] = '0px';
        }

        if ((row + 1) % 3 == 0 && (row + 1) != 9) {
            textInput.style['border-bottom-width'] = '2px';
        } else {
            textInput.style['border-bottom-width'] = '1px';
        }

        textInput.addEventListener('keydown', cellDeleteListener, false);
        textInput.addEventListener('keydown', cellTabListener, false);
        textInput.addEventListener('keypress', cellAddListener, false);

        return textInput;
    };

    var isEmptyCell = function(node) {
        return node.nodeName == 'INPUT' &&
               node.type == 'text' &&
               node.id != 'board_text' &&
               node.value == '';
    };

    var getNextEmptyCell = function(node) {
        node = node.nextSibling;
        while (node != null) {
            if (isEmptyCell(node)) {
                return node;
            }
            node = node.nextSibling;
        }
        return null;
    };

    var getPreviousEmptyCell = function(node) {
        node = node.previousSibling;
        while (node != null) {
            if (isEmptyCell(node)) {
                return node;
            }
            node = node.previousSibling;
        }
        return null;
    };

    var validBoard = function(board) {
        var hasNonZeroDuplicate = function(array) {
            var unique = [];
            for (var i = 0; i < array.length; ++i) {
                if (unique.indexOf(array[i]) == -1) {
                    unique.push(array[i]);
                } else if (array[i] != 0) {
                    return true;
                }
            }
            return false;
        };

        for (var i = 0; i < 9; ++i) {
            var row = getRow(board, i);
            var col = getCol(board, i);
            var box = getBox(board, i);

            var invalidRow = hasNonZeroDuplicate(row);
            var invalidCol = hasNonZeroDuplicate(col);
            var invalidBox = hasNonZeroDuplicate(box);
            if (invalidRow || invalidCol || invalidBox) {
                return false;
            }
        }

        return true;
    };

    var cellAddListener = function(e) {
        var strCode = String.fromCharCode(e.keyCode);
        var isDigit = strCode >= '0' && strCode <= '9';
        if (isDigit) {
            var oldValue = e.target.value.slice(0);
            e.target.value = '';
            var board = getBoard();

            var cellIndex = 1 * e.target.id;
            var rowIndex = Math.floor(cellIndex / 9);
            var colIndex = cellIndex % 9;
            var poss = possibleValues(board, rowIndex, colIndex);
            if (poss.indexOf(strCode) == -1) {
                e.target.value = oldValue;
            } else {
                e.target.value = strCode;
                var node = getNextEmptyCell(e.target);
                if (node) {
                    node.focus();
                }
                document.getElementById('board_text').value = getBoard();
            }
        }

        e.preventDefault();
    };

    var cellDeleteListener = function(e) {
        if (e.keyCode == 8 || e.keyCode == 46) {
            e.target.value = '';
            document.getElementById('board_text').value = getBoard();
            e.preventDefault();
        }
    };

    var cellTabListener = function(e) {
        if (e.keyCode == 9) {
            if (e.shiftKey) {
                var node = getPreviousEmptyCell(e.target);
            } else {
                var node = getNextEmptyCell(e.target);
            }
            if (node) {
                node.focus();
            }
            e.preventDefault();
        }
    };

    var getBoard = function() {
        var board = '';

        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; ++i) {
            if (inputs[i].type == 'text' && inputs[i].id != 'board_text') {
                if (inputs[i].value) {
                    var c = inputs[i].value[0];
                    if (c < '1' || c > '9') {
                        c = '0';
                    }
                } else {
                    c = '0';
                }
                board = board + c;
            }
        }

        return board;
    };

    var setBoard = function(board) {
        var inputs = document.getElementsByTagName('input');
        var index = 0;
        for (var i = 0; i < inputs.length; ++i) {
            if (inputs[i].type == 'text' && inputs[i].id != 'board_text') {
                if (board[index] != '0') {
                    inputs[i].value = board[index];
                } else {
                    inputs[i].value = '';
                }
                index++;
            }
        }
    };

    var getRow = function(board, rowIndex) {
        return board.slice(rowIndex * 9, rowIndex * 9 + 9);
    };

    var getCol = function(board, colIndex) {
        var col = '';
        for (var i = 0; i < 9; ++i) {
            col = col + board[i * 9 + colIndex];
        }
        return col;
    };
    
    var getCell = function(board, rowIndex, colIndex) {
        return getRow(board, rowIndex)[colIndex];
    };

    var getBox = function(board, boxIndex) {
        var boxRow = Math.floor(boxIndex / 3);
        var boxCol = boxIndex % 3;
        var startRow = boxRow * 3;
        var startCol = boxCol * 3;
        var box = '';
        for (var i = startRow; i < startRow + 3; ++i) {
            for (var j = startCol; j < startCol + 3; ++j) {
                box = box + getCell(board, i, j);
            }
        }
        return box;
    };

    var isGroupFull = function(group) {
        return group.indexOf('0') == -1;
    }

    var isRowFull = function(board, rowIndex) {
        return isGroupFull(getRow(board, rowIndex));
    };

    var isColFull = function(board, colIndex) {
        return isGroupFull(getCol(board, colIndex));
    };

    var isBoxFull = function(board, boxIndex) {
        return isGroupFull(getBox(board, boxIndex));
    };

    var isSolved = function(board) {
        for (var i = 0; i < 9; ++i) {
            var rowFull = isRowFull(board, i);
            var colFull = isColFull(board, i);
            var boxFull = isBoxFull(board, i);
            if (!(rowFull && colFull && boxFull)) {
                return false;
            }
        }
        return true;
    };

    var possibleValues = function(board, rowIndex, colIndex) {
        if (getCell(board, rowIndex, colIndex) != '0') {
            return '';
        } else {
            var boxIndex = Math.floor(rowIndex / 3) * 3 + Math.floor(colIndex / 3);
            var full = '0123456789'.split('');
            var row = getRow(board, rowIndex);
            var col = getCol(board, colIndex);
            var box = getBox(board, boxIndex);
            for (var i = 0; i < row.length; ++i) {
                full[row[i] - '0'] = '0';
                full[col[i] - '0'] = '0';
                full[box[i] - '0'] = '0';
            }

            var poss = '';
            for (var i = 0; i < full.length; ++i) {
                if (full[i] != '0') {
                    poss = poss + full[i];
                }
            }
            return poss;
        }
    };

    var setCell = function(board, rowIndex, colIndex, value) {
        var index = rowIndex * 9 + colIndex;
        return board.slice(0, index) + value + board.slice(index + 1);
    };

    var getFirstEmpty = function(board) {
        var index = board.indexOf('0');
        var rowIndex = Math.floor(index / 9);
        var colIndex = index % 9;
        return [rowIndex, colIndex];
    };

    var getAllEmpty = function(board) {
        var board = board.slice(0);
        var empty = [];
        var index = board.indexOf('0');
        var removedLen = 0;
        while (index != -1) {
            var origIndex = removedLen + index;
            var rowIndex = Math.floor(origIndex / 9);
            var colIndex = origIndex % 9;
            empty.push([rowIndex, colIndex]);
            board = board.slice(index + 1);
            removedLen += index + 1;
            index = board.indexOf('0');
        }
        return empty;
    };

    var solve = function(board) {
        var emptyCoords = getAllEmpty(board);
        emptyCoords.sort(function(a, b) {
            var rowIndexA = a[0];
            var colIndexA = a[1];
            var rowIndexB = b[0];
            var colIndexB = b[1];
            var possA = possibleValues(board, rowIndexA, colIndexA);
            var possB = possibleValues(board, rowIndexB, colIndexB);
            return possA.length - possB.length;
        });

        var solveRecursive = function(level) {
            if (isSolved(board)) {
                return true;
            } else {
                var emptyCoord = emptyCoords[level];
                var rowIndex = emptyCoord[0];
                var colIndex = emptyCoord[1];
                var poss = possibleValues(board, rowIndex, colIndex);
                var boardCopy = board.slice(0);

                for (var i = 0; i < poss.length; ++i) {
                    board = setCell(board, rowIndex, colIndex, poss[i]);
                    if (solveRecursive(level + 1)) {
                        return true;
                    } else {
                        board = boardCopy;
                    }
                }

                return false;
            }
        };

        var boardCopy = board.slice(0);
        if (solveRecursive(0)) {
            return board;
        } else {
            return boardCopy;
        }
    };

    var solveButtonHandler = function(e) {
        var board = getBoard();
        var solvedBoard = solve(board);
        setBoard(solvedBoard);
        document.getElementById('board_text').value = solvedBoard;
    };

    var loadButtonHandler = function(e) {
        var boardTextNode = document.getElementById('board_text');
        var boardText = boardTextNode.value;
        boardText = boardText.replace(/[.]/g, '0');
        boardText = boardText.replace(/[^0-9]/g, '');
        boardText = boardText.slice(0, 9 * 9);
        if (boardText.length < 9 * 9 || !validBoard(boardText)) {
            return;
        }
        boardTextNode.value = boardText;
        setBoard(boardText);
        disableFilledCells();
    };

    var enableAllCells = function() {
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; ++i) {
            if (inputs[i].type == 'text' &&
                inputs[i].id != 'board_text') {
                inputs[i].disabled = false;
            }
        }
        var buttons = document.getElementsByTagName('button');
        for (var i = 0; i < buttons.length; ++i) {
            if (buttons[i].firstChild.data == 'Unset') {
                buttons[i].firstChild.data = 'Set';
            }
        }
    };

    var disableFilledCells = function() {
        enableAllCells();
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; ++i) {
            if (inputs[i].type == 'text' &&
                inputs[i].id != 'board_text' &&
                inputs[i].value != '') {
                inputs[i].disabled = true;
            }
        }
        var buttons = document.getElementsByTagName('button');
        for (var i = 0; i < buttons.length; ++i) {
            if (buttons[i].firstChild.data == 'Set') {
                buttons[i].firstChild.data = 'Unset';
            }
        }
    };

    var setButtonHandler = function(e) {
        if (e.target.firstChild.data == 'Set') {
            disableFilledCells();
        } else {
            enableAllCells();
        }
    };

    var clearButtonHandler = function(e) {
        enableAllCells();
        var inputs = document.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; ++i) {
            if (inputs[i].type == 'text' &&
                inputs[i].id != 'board_text') {
                inputs[i].value = '';
            }
        }
        document.getElementById('board_text').value = '';
    };

    window.onload = function() {
        var body = document.getElementsByTagName('body')[0];
        body.style.margin = '0 auto';
        body.style['max-width'] = '500px';

        var sudokuText = document.createElement('h2');
        sudokuText.style['font-family'] = 'sans-serif';
        sudokuText.appendChild(document.createTextNode('Sudoku'));
        body.appendChild(sudokuText);

        for (var i = 0; i < 9; ++i) {
            for (var j = 0; j < 9; ++j) {
                body.appendChild(createCell(i, j));
            }
            body.appendChild(document.createElement('br'));
        }

        body.appendChild(document.createElement('br'));

        var boardText = document.createElement('input');
        boardText.id = 'board_text';
        boardText.type = 'text';
        boardText.style['font-family'] = 'sans-serif';
        boardText.size = 81;
        body.appendChild(boardText);
        body.appendChild(document.createElement('br'));
        body.appendChild(document.createElement('br'));

        var clearButton = document.createElement('button');
        clearButton.appendChild(document.createTextNode('Clear'));
        clearButton.addEventListener('click', clearButtonHandler, false);
        body.appendChild(clearButton);

        var setButton = document.createElement('button');
        setButton.appendChild(document.createTextNode('Set'));
        setButton.addEventListener('click', setButtonHandler, false);
        body.appendChild(setButton);

        var loadButton = document.createElement('button');
        loadButton.appendChild(document.createTextNode('Load'));
        loadButton.addEventListener('click', loadButtonHandler, false);
        body.appendChild(loadButton);

        var solveButton = document.createElement('button');
        solveButton.appendChild(document.createTextNode('Solve'));
        solveButton.addEventListener('click', solveButtonHandler, false);
        body.appendChild(solveButton);

        initialBoard = "070040000024081697091036245749050361530000700160000004000915403917020000000070900";
        setBoard(initialBoard);
        disableFilledCells();
        boardText.value = initialBoard;
    };
}());
