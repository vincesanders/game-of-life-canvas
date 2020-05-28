import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Overlay from './components/Overlay';
import './index.css';
import createGrid from './utils/createGrid';

const coolie = 'a{35}Gda{13}Gda{13}Gea{13}qca{13}Ga{15}ca{13}Gahao5aWbhao5aWbca{14}fa{13}qba{15}fakOaqbfakOaqba{16}caeqaGacaeqaGa{45}GdSFdH0BiSFdH0BGda{13}GeaaGcaauaaGcaaqca{13}GaijzmjjJjjzmjjaca{13}GaaaymaaJbaymaaaca{14}fW#Wg+h3W#Wg+hqba{16}gOkWavbgOkWa{18}WWCCgMJZWCCgga{19}sKaqIeasKa{17}Gda{13}Gda{13}Gea{13}qca{13}Gaaaw1aWIgaw1aaaca{13}Gaaaiiaabbaiiaaaca{14}fa{13}qba{17}qeaaIaaqea{21}Wgaa3aaWga{17}GdaaOkaavbaOkaaGda{13}GeaaqeaaIaaqeaaqca{13}GaaaymaaJbaymaaaca{13}Ga{15}ca{14}fa{13}qba{73}Gdaaa5aWbhaoaaaGda{13}Gea{13}qca{13}Ga{4}Oaqbfaka{4}ca{13}Ga{4}qaGacaea{4}ca{14}fa{13}qba{18}G0BiSFda{26}ua{27}jjJjjba{18}Gda{6}Jba{5}Gda{13}Gea{4}+h3W#a{4}qca{13}Ga{5}Wavbga{5}ca{13}Ga{5}gMJZWa{5}ca{14}fa{5}qIea{5}qba{80}WIga{20}Gda{6}bba{5}Gda{13}Gea{13}qca{13}Ga{7}Ia{7}ca{13}Ga{7}3a{7}ca{14}fa{6}vba{5}qba{21}Ia{29}Jba{50}Gda{13}Gda{13}Gea{13}qca{13}Ga{15}ca{13}Ga{15}ca{14}fa{13}qba{103}Gda{13}Gda{13}Gea{13}qca{13}Ga{15}ca{13}Ga{15}ca{14}fa{13}qba{68}'

const weekender = 'a{187}caeqaGacaeqaGa{17}hao5aWbhao5aWba{16}hao5aWbhao5aWba{76}igbaXiaigbaXia{17}76LtpVC76LtpVa{17}76LtpVC76LtpVa{19}qeaaIaaqea{19}GFWg9d3GFWg9da{17}WWGcgguWWGcgga{17}WWymggJXWymgga{19}myaGbdamya{21}gWaWagagWa{21}w1aWIgaw1a{21}uuaGIcauua{21}iiaabbaiia{81}5oaa4ba5oa{21}GcaauaaGca{21}iiaabbaiia{21}iiaabbaiia{21}qeaaIaaqea{112}qaGacaea{23}5aWbhaoa{23}5aWbhaoa{84}Xiaigba{23}qpVC76fa{23}qpVC76fa{26}Ia{27}9d3GFa{25}gguWWa{25}ggJXWa{26}Gbda{27}Waga{27}WIga{27}GIca{28}bba{88}4ba{28}ua{29}bba{28}bba{28}Ia{406}'

//rle (run length encoded) format
const glider = {
  
}

const data = {
  cols: 180,
  rows: 70,
  speed: 10,
  cellSize: 8,
  randomLive: 10,
  generation: 0,
  grid: [],
  Overlay,
  base64: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890+#',
  testFile: coolie
}

data.grid = createGrid(data.rows, data.cols, data.randomLive);

ReactDOM.render(
  <React.StrictMode>
    <App data={data} />
  </React.StrictMode>,
  document.getElementById('root')
);
