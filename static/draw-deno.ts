// TODO: import absolute URL
import { Color, Drawing } from "../static/painter.ts";

const d = new Drawing();
d.border(Color.Green);

// First letter
d.vl(2, 2, 6, Color.Black);
d.setPixel(3, 2, Color.Black);
d.setPixel(4, 3, Color.Black);
d.vl(4, 4, 2, Color.Black);
d.setPixel(4, 6, Color.Black);
d.setPixel(3, 7, Color.Black);

// Second letter
d.vl(6, 2, 6, Color.Black);
d.setPixel(7, 2, Color.Black);
d.setPixel(8, 2, Color.Black);
d.setPixel(7, 4, Color.Black);
d.setPixel(7, 7, Color.Black);
d.setPixel(8, 7, Color.Black);

// Third letter
d.vl(10, 2, 6, Color.Black);
d.setPixel(11, 4, Color.Black);
d.setPixel(12, 5, Color.Black);
d.vl(13, 2, 6, Color.Black);

// Fourth letter
d.vl(15, 3, 4, Color.Black);
d.setPixel(16, 2, Color.Black);
d.setPixel(16, 7, Color.Black);
d.vl(17, 3, 4, Color.Black);

// Icon
d.setPixel(10, 12, Color.Red);

// Icon: left half
d.setPixel(9, 11, Color.Red);
d.setPixel(8, 12, Color.Red);
d.setPixel(8, 13, Color.Red);
d.setPixel(9, 14, Color.Red);
d.setPixel(10, 15, Color.Red);

// Icon: right half
d.setPixel(11, 11, Color.Red);
d.setPixel(12, 12, Color.Red);
d.setPixel(12, 12, Color.Red);
d.setPixel(12, 13, Color.Red);
d.setPixel(11, 14, Color.Red);

export default d.complete();
