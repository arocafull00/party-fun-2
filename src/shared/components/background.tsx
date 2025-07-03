import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Svg, { 
  Rect, 
  Polygon, 
  Circle, 
  Line, 
  Polyline 
} from 'react-native-svg';

interface BackgroundProps {
  children?: React.ReactNode;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export const Background: React.FC<BackgroundProps> = ({ children }) => {
  // Calculate aspect ratio to maintain proper scaling
  const aspectRatio = screenWidth / screenHeight;
  const baseWidth = 1080;
  const baseHeight = 1920;
  const baseAspectRatio = baseWidth / baseHeight;
  
  // Adjust viewBox based on screen aspect ratio
  let viewBoxWidth = baseWidth;
  let viewBoxHeight = baseHeight;
  
  if (aspectRatio > baseAspectRatio) {
    // Screen is wider than base design
    viewBoxWidth = baseHeight * aspectRatio;
  } else {
    // Screen is taller than base design
    viewBoxHeight = baseWidth / aspectRatio;
  }

  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        preserveAspectRatio="xMidYMid slice"
        style={styles.svg}
      >
        {/* Background rectangle */}
        <Rect fill="rgb(58, 87, 145)" height="100%" width="100%" x="0" y="0" />
        
        {/* All the geometric shapes from the original SVG */}
        <Polygon fill="#000000" fillOpacity="0.08" points="471.0,1297.0 463.5,1309.9903810567666 448.5,1309.9903810567666 441.0,1297.0 448.5,1284.0096189432334 463.5,1284.0096189432334" />
        <Circle cx="126" cy="88" fill="#000000" fillOpacity="0.08" r="14" />
        <Polygon fill="#000000" fillOpacity="0.08" points="652.0,204.0 646.0,214.39230484541326 634.0,214.39230484541326 628.0,204.0 634.0,193.60769515458674 646.0,193.60769515458674" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="718" x2="746" y1="1604" y2="1604" />
        <Polygon fill="#000000" fillOpacity="0.08" points="232,1660 217,1690 247,1690" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="331" x2="359" y1="977" y2="977" />
        <Polyline fill="#000000" fillOpacity="0.08" points="206,612 214.0,628 206,628 214.0,644" />
        <Circle cx="893" cy="975" fill="#000000" fillOpacity="0.08" r="11" />
        <Circle cx="642" cy="1824" fill="#000000" fillOpacity="0.08" r="11" />
        <Circle cx="78" cy="1819" fill="#000000" fillOpacity="0.08" r="8" />
        <Polygon fill="#000000" fillOpacity="0.08" points="482,1472 466,1504 498,1504" />
        <Polygon fill="#000000" fillOpacity="0.08" points="495,841 479,873 511,873" />
        <Polygon fill="#000000" fillOpacity="0.08" points="1021,416 1005,448 1037,448" />
        <Circle cx="884" cy="317" fill="#000000" fillOpacity="0.08" r="8" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="338" x2="358" y1="109" y2="109" />
        <Circle cx="682" cy="1443" fill="#000000" fillOpacity="0.08" r="15" />
        <Polygon fill="#000000" fillOpacity="0.08" points="853,401 842,423 864,423" />
        <Polygon fill="#000000" fillOpacity="0.08" points="678,11 663,41 693,41" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="884" x2="916" y1="48" y2="48" />
        <Polygon fill="#000000" fillOpacity="0.08" points="327,1023 313,1051 341,1051" />
        <Polygon fill="#000000" fillOpacity="0.08" points="140,609 127,635 153,635" />
        <Polygon fill="#000000" fillOpacity="0.08" points="895,251 883,275 907,275" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="127" x2="145" y1="1751" y2="1751" />
        <Polyline fill="#000000" fillOpacity="0.08" points="376,332 383.5,347 376,347 383.5,362" />
        <Polygon fill="#000000" fillOpacity="0.08" points="215.0,1856.0 208.0,1868.124355652982 194.0,1868.124355652982 187.0,1856.0 194.0,1843.875644347018 208.0,1843.875644347018" />
        <Circle cx="618" cy="475" fill="#000000" fillOpacity="0.08" r="9" />
        <Polyline fill="#000000" fillOpacity="0.08" points="987,1470 994.5,1485 987,1485 994.5,1500" />
        <Polygon fill="#000000" fillOpacity="0.08" points="285,296 274,318 296,318" />
        <Polyline fill="#000000" fillOpacity="0.08" points="329,1307 334.5,1318 329,1318 334.5,1329" />
        <Circle cx="1057" cy="1102" fill="#000000" fillOpacity="0.08" r="11" />
        <Polyline fill="#000000" fillOpacity="0.08" points="59,1456 66.5,1471 59,1471 66.5,1486" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="196" x2="212" y1="1867" y2="1867" />
        <Polyline fill="#000000" fillOpacity="0.08" points="666,550 672.0,562 666,562 672.0,574" />
        <Polyline fill="#000000" fillOpacity="0.08" points="207,629 214.5,644 207,644 214.5,659" />
        <Polygon fill="#000000" fillOpacity="0.08" points="58,752 46,776 70,776" />
        <Polyline fill="#000000" fillOpacity="0.08" points="759,172 765.5,185 759,185 765.5,198" />
        <Circle cx="239" cy="1721" fill="#000000" fillOpacity="0.08" r="12" />
        <Polygon fill="#000000" fillOpacity="0.08" points="514.0,1644.0 506.0,1657.856406460551 490.0,1657.856406460551 482.0,1644.0 490.0,1630.143593539449 506.0,1630.143593539449" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="890" x2="912" y1="392" y2="392" />
        <Circle cx="264" cy="183" fill="#000000" fillOpacity="0.08" r="8" />
        <Circle cx="373" cy="118" fill="#000000" fillOpacity="0.08" r="14" />
        <Polyline fill="#000000" fillOpacity="0.08" points="357,591 363.0,603 357,603 363.0,615" />
        <Circle cx="442" cy="247" fill="#000000" fillOpacity="0.08" r="10" />
        <Polygon fill="#000000" fillOpacity="0.08" points="353.0,485.0 347.0,495.39230484541326 335.0,495.39230484541326 329.0,485.0 335.0,474.60769515458674 347.0,474.60769515458674" />
        <Polygon fill="#000000" fillOpacity="0.08" points="146.0,1738.0 138.5,1750.9903810567666 123.5,1750.9903810567666 116.0,1738.0 123.5,1725.0096189432334 138.5,1725.0096189432334" />
        <Circle cx="1068" cy="890" fill="#000000" fillOpacity="0.08" r="8" />
        <Polyline fill="#000000" fillOpacity="0.08" points="796,588 801.0,598 796,598 801.0,608" />
        <Polygon fill="#000000" fillOpacity="0.08" points="658.0,1277.0 653.0,1285.6602540378444 643.0,1285.6602540378444 638.0,1277.0 643.0,1268.3397459621556 653.0,1268.3397459621556" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="254" x2="274" y1="584" y2="584" />
        <Circle cx="169" cy="269" fill="#000000" fillOpacity="0.08" r="11" />
        <Polygon fill="#000000" fillOpacity="0.08" points="811.0,1464.0 806.5,1471.79422863406 797.5,1471.79422863406 793.0,1464.0 797.5,1456.20577136594 806.5,1456.20577136594" />
        <Polyline fill="#000000" fillOpacity="0.08" points="394,213 401.5,228 394,228 401.5,243" />
        <Polyline fill="#000000" fillOpacity="0.08" points="931,525 935.5,534 931,534 935.5,543" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="558" x2="588" y1="258" y2="258" />
        <Polygon fill="#000000" fillOpacity="0.08" points="269,1823 258,1845 280,1845" />
        <Polygon fill="#000000" fillOpacity="0.08" points="560,540 549,562 571,562" />
        <Polygon fill="#000000" fillOpacity="0.08" points="696.0,1354.0 691.5,1361.79422863406 682.5,1361.79422863406 678.0,1354.0 682.5,1346.20577136594 691.5,1346.20577136594" />
        <Polyline fill="#000000" fillOpacity="0.08" points="370,1432 377.0,1446 370,1446 377.0,1460" />
        <Polygon fill="#000000" fillOpacity="0.08" points="55,318 46,336 64,336" />
        <Polyline fill="#000000" fillOpacity="0.08" points="925,1203 930.0,1213 925,1213 930.0,1223" />
        <Circle cx="336" cy="1191" fill="#000000" fillOpacity="0.08" r="11" />
        <Polygon fill="#000000" fillOpacity="0.08" points="709.0,688.0 703.5,697.5262794416288 692.5,697.5262794416288 687.0,688.0 692.5,678.4737205583712 703.5,678.4737205583712" />
        <Polyline fill="#000000" fillOpacity="0.08" points="120,1764 126.5,1777 120,1777 126.5,1790" />
        <Circle cx="202" cy="622" fill="#000000" fillOpacity="0.08" r="12" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="226" x2="246" y1="1428" y2="1428" />
        <Polygon fill="#000000" fillOpacity="0.08" points="374.0,1874.0 366.5,1886.9903810567666 351.5,1886.9903810567666 344.0,1874.0 351.5,1861.0096189432334 366.5,1861.0096189432334" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="1057" x2="1079" y1="1540" y2="1540" />
        <Polyline fill="#000000" fillOpacity="0.08" points="509,1737 517.0,1753 509,1753 517.0,1769" />
        <Polygon fill="#000000" fillOpacity="0.08" points="402,1401 394,1417 410,1417" />
        <Polygon fill="#000000" fillOpacity="0.08" points="230,798 214,830 246,830" />
        <Polygon fill="#000000" fillOpacity="0.08" points="391.0,968.0 383.5,980.9903810567665 368.5,980.9903810567666 361.0,968.0 368.5,955.0096189432335 383.5,955.0096189432334" />
        <Polygon fill="#000000" fillOpacity="0.08" points="1030,897 1018,921 1042,921" />
        <Circle cx="533" cy="1565" fill="#000000" fillOpacity="0.08" r="10" />
        <Polyline fill="#000000" fillOpacity="0.08" points="674,1423 682.0,1439 674,1439 682.0,1455" />
        <Polyline fill="#000000" fillOpacity="0.08" points="426,369 431.5,380 426,380 431.5,391" />
        <Circle cx="473" cy="459" fill="#000000" fillOpacity="0.08" r="9" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="178" x2="210" y1="811" y2="811" />
        <Polygon fill="#000000" fillOpacity="0.08" points="329.0,632.0 323.0,642.3923048454133 311.0,642.3923048454133 305.0,632.0 311.0,621.6076951545867 323.0,621.6076951545867" />
        <Polyline fill="#000000" fillOpacity="0.08" points="325,1664 329.5,1673 325,1673 329.5,1682" />
        <Polyline fill="#000000" fillOpacity="0.08" points="815,1169 822.0,1183 815,1183 822.0,1197" />
        <Polygon fill="#000000" fillOpacity="0.08" points="888,76 872,108 904,108" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="1066" x2="1090" y1="111" y2="111" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="675" x2="703" y1="479" y2="479" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="774" x2="796" y1="636" y2="636" />
        <Polygon fill="#000000" fillOpacity="0.08" points="1070.0,774.0 1065.0,782.6602540378444 1055.0,782.6602540378444 1050.0,774.0 1055.0,765.3397459621556 1065.0,765.3397459621556" />
        <Polyline fill="#000000" fillOpacity="0.08" points="395,569 402.5,584 395,584 402.5,599" />
        <Circle cx="711" cy="1548" fill="#000000" fillOpacity="0.08" r="8" />
        <Polyline fill="#000000" fillOpacity="0.08" points="124,1598 132.0,1614 124,1614 132.0,1630" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="460" x2="478" y1="210" y2="210" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="391" x2="423" y1="1560" y2="1560" />
        <Polygon fill="#000000" fillOpacity="0.08" points="512,1143 498,1171 526,1171" />
        <Polygon fill="#000000" fillOpacity="0.08" points="633.0,890.0 626.5,901.2583302491977 613.5,901.2583302491977 607.0,890.0 613.5,878.7416697508023 626.5,878.7416697508023" />
        <Line stroke="#000000" strokeOpacity="0.08" strokeWidth="2" x1="216" x2="246" y1="1080" y2="1080" />
        <Polygon fill="#000000" fillOpacity="0.08" points="168.0,287.0 161.5,298.2583302491977 148.5,298.2583302491977 142.0,287.0 148.5,275.7416697508023 161.5,275.7416697508023" />
        <Polygon fill="#000000" fillOpacity="0.08" points="133.0,1555.0 125.0,1568.856406460551 109.0,1568.856406460551 101.0,1555.0 109.0,1541.143593539449 124.99999999999999,1541.143593539449" />
        <Polygon fill="#000000" fillOpacity="0.08" points="519,38 510,56 528,56" />
        <Polygon fill="#000000" fillOpacity="0.08" points="254.0,905.0 250.0,911.9282032302755 242.0,911.9282032302755 238.0,905.0 242.0,898.0717967697245 250.0,898.0717967697245" />
        <Polygon fill="#000000" fillOpacity="0.08" points="70,821 55,851 85,851" />
        <Circle cx="617" cy="495" fill="#000000" fillOpacity="0.08" r="10" />
        <Circle cx="806" cy="1592" fill="#000000" fillOpacity="0.08" r="8" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -100,
    width: '100%',
    height: '100%',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});

export default Background;
