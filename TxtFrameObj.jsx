/*--------------------------------------------------
バラバラのテキストを一つのフレームにまとめるスクリプト

まとめたいテキストを全て選択してスクリプトを走らせる事で
選択範囲の高さと幅にあわせたテキストフレームを作成してテキストを流し込みます
クリッピングマスクは予め解除しておくことを推奨します
20221202 作成

Script to Merge Scattered Text into a Single Frame

By selecting all the text you want to merge and running this script,
a new text frame will be created that matches the height and width of the selected area, and the text will be flowed into it.
It is recommended to release any clipping masks beforehand.
Created on 2022-12-02
--------------------------------------------------*/

app.executeMenuCommand('releaseMask');
app.executeMenuCommand('ungroup');

var DOC = app.activeDocument;
var SEL = DOC.selection;
var Lay = DOC.layers.getByName(app.selection[0].parent.name);

// 選択オブジェクトの初期値を取得
var RCT = SEL[0].visibleBounds;
var x1 = RCT[0];
var y1 = RCT[1];
var x2 = RCT[2];
var y2 = RCT[3];

// 選択オブジェクトの範囲を計算
for (var N = 1; N < SEL.length; N++) {
    var BND = SEL[N].visibleBounds;
    if (BND[0] < x1) x1 = BND[0];
    if (BND[1] > y1) y1 = BND[1];
    if (BND[2] > x2) x2 = BND[2];
    if (BND[3] < y2) y2 = BND[3];
}

// ★ 右と下を 1mm (2.8346pt) 広げる
var mm = 2.8346;
x2 += mm;
y2 -= mm;

var W = x2 - x1;
var H = y1 - y2;

// テキストフレーム作成（左上固定）
var rectRef = Lay.pathItems.rectangle(y1, x1, W, H);
var areaTextRef = Lay.textFrames.areaText(rectRef, TextOrientation.HORIZONTAL, undefined, false);
areaTextRef.contents = "";

//テキストを格納
for (var i=0; i < SEL.length; i++){
	SEL[i].textRange.move(areaTextRef, ElementPlacement.PLACEATBEGINNING);
	SEL[i].remove();
	SEL[i] = areaTextRef;
}
DOC.selection = SEL;
