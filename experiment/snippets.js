this.AAAonSegment = function(p, q, r)
{
	if (q.x <= Math.max(p.x, r.x)
		&& q.x >= Math.min(p.x, r.x)
		&& q.y <= Math.max(p.y, r.y)
		&& q.y >= Math.min(p.y, r.y))
	{
		return true;
	}

	return false;
}

this.AAAorientation = function(p, q, r)
{
	// See https://www.geeksforgeeks.org/orientation-3-ordered-points/
	// for details of below formula.
	var v = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

	if (v == 0) return 0; // colinear

	return (v > 0) ? 1 : 2; // clock or counterclock wis
}

this.AAAdoIntersect = function(p1, q1, p2, q2)
{
	var o1 = this.AAAorientation(p1, q1, p2);
	var o2 = this.AAAorientation(p1, q1, q2);
	var o3 = this.AAAorientation(p2, q2, p1);
	var o4 = this.AAAorientation(p2, q2, q1);

	// General case
	if (o1 != o2 && o3 != o4)
		return true;

	// Special Cases
	// p1, q1 and p2 are colinear and p2 lies on segment p1q1
	if (o1 == 0 && this.AAAonSegment(p1, p2, q1)) return true;

	// p1, q1 and q2 are colinear and q2 lies on segment p1q1
	if (o2 == 0 && this.AAAonSegment(p1, q2, q1)) return true;

	// p2, q2 and p1 are colinear and p1 lies on segment p2q2
	if (o3 == 0 && this.AAAonSegment(p2, p1, q2)) return true;

	// p2, q2 and q1 are colinear and q1 lies on segment p2q2
	if (o4 == 0 && this.AAAonSegment(p2, q1, q2)) return true;

	return false; // Doesn't fall in any of the above cases
}





this.fenceDoesBoundingBoxesOverlapTest = function()
{
	// two vertical lines
	var s1 = {a:{x:0,y:0},b:{x:0,y:1}};
	var s2 = {a:{x:1,y:0},b:{x:1,y:1}};
	
	// two horizontal lines
	var s3 = {a:{x:0,y:0},b:{x:1,y:0}};
	var s4 = {a:{x:0,y:1},b:{x:1,y:1}};

	// two diagonal crossing lines
	var s5 = {a:{x:0,y:0},b:{x:1,y:1}};
	var s6 = {a:{x:1,y:0},b:{x:0,y:1}};

	var s5 = {a:{x:0,y:0},b:{x:1,y:1}};
	var s6 = {a:{x:1,y:0},b:{x:0,y:1}};

	var t1 = this.fenceDoesBoundingBoxesOverlap(s1, s2) == false;
	var t2 = this.fenceDoesBoundingBoxesOverlap(s2, s1) == false;
	var t3 = this.fenceDoesBoundingBoxesOverlap(s3, s4) == false;
	var t4 = this.fenceDoesBoundingBoxesOverlap(s4, s3) == false;
	var t5 = this.fenceDoesBoundingBoxesOverlap(s5, s6) == true;
	var t6 = this.fenceDoesBoundingBoxesOverlap(s6, s5) == true;

	var sAC = {a:{x:1,y:1},b:{x:2,y:2}};
	var sA1 = {a:{x:0,y:0},b:{x:1,y:1}};
	var sA2 = {a:{x:1,y:0},b:{x:2,y:1}};
	var sA3 = {a:{x:2,y:0},b:{x:3,y:1}};
	
	var sA4 = {a:{x:0,y:1},b:{x:1,y:2}};
	var sA5 = {a:{x:2,y:1},b:{x:3,y:2}};
	
	var sA6 = {a:{x:0,y:2},b:{x:1,y:3}};
	var sA7 = {a:{x:1,y:2},b:{x:2,y:3}};
	var sA8 = {a:{x:2,y:2},b:{x:3,y:3}};

	var tA1 = this.fenceDoesBoundingBoxesOverlap(sAC, sA1) == true;
	var tA2 = this.fenceDoesBoundingBoxesOverlap(sAC, sA2) == true;
	var tA3 = this.fenceDoesBoundingBoxesOverlap(sAC, sA3) == true;
	var tA4 = this.fenceDoesBoundingBoxesOverlap(sAC, sA4) == true;
	var tA5 = this.fenceDoesBoundingBoxesOverlap(sAC, sA5) == true;
	var tA6 = this.fenceDoesBoundingBoxesOverlap(sAC, sA6) == true;
	var tA7 = this.fenceDoesBoundingBoxesOverlap(sAC, sA7) == true;
	var tA8 = this.fenceDoesBoundingBoxesOverlap(sAC, sA8) == true;
	var tA1r = this.fenceDoesBoundingBoxesOverlap(sA1, sAC) == true;
	var tA2r = this.fenceDoesBoundingBoxesOverlap(sA2, sAC) == true;
	var tA3r = this.fenceDoesBoundingBoxesOverlap(sA3, sAC) == true;
	var tA4r = this.fenceDoesBoundingBoxesOverlap(sA4, sAC) == true;
	var tA5r = this.fenceDoesBoundingBoxesOverlap(sA5, sAC) == true;
	var tA6r = this.fenceDoesBoundingBoxesOverlap(sA6, sAC) == true;
	var tA7r = this.fenceDoesBoundingBoxesOverlap(sA7, sAC) == true;
	var tA8r = this.fenceDoesBoundingBoxesOverlap(sA8, sAC) == true;

	var sBC = {a:{x:1,y:1},b:{x:2,y:2}};
	
	var sB1 = {a:{x:1,y:0},b:{x:0,y:1}};
	var sB2 = {a:{x:2,y:0},b:{x:1,y:1}};
	var sB3 = {a:{x:3,y:0},b:{x:2,y:1}};
	
	var sB4 = {a:{x:1,y:1},b:{x:0,y:2}};
	var sB5 = {a:{x:2,y:1},b:{x:1,y:2}};
	var sB6 = {a:{x:3,y:1},b:{x:2,y:2}};
	
	var sB7 = {a:{x:1,y:2},b:{x:0,y:3}};
	var sB8 = {a:{x:2,y:2},b:{x:1,y:3}};
	var sB9 = {a:{x:3,y:2},b:{x:2,y:3}};

	var tB1 = this.fenceDoesBoundingBoxesOverlap(sBC, sB1) == true;
	var tB2 = this.fenceDoesBoundingBoxesOverlap(sBC, sB2) == true;
	var tB3 = this.fenceDoesBoundingBoxesOverlap(sBC, sB3) == true;
	
	var tB4 = this.fenceDoesBoundingBoxesOverlap(sBC, sB4) == true;
	var tB5 = this.fenceDoesBoundingBoxesOverlap(sBC, sB5) == true;
	var tB6 = this.fenceDoesBoundingBoxesOverlap(sBC, sB6) == true;
	
	var tB7 = this.fenceDoesBoundingBoxesOverlap(sBC, sB7) == true;
	var tB8 = this.fenceDoesBoundingBoxesOverlap(sBC, sB8) == true;
	var tB9 = this.fenceDoesBoundingBoxesOverlap(sBC, sB9) == true;
	
	var tB1r = this.fenceDoesBoundingBoxesOverlap(sB1, sBC) == true;
	var tB2r = this.fenceDoesBoundingBoxesOverlap(sB2, sBC) == true;
	var tB3r = this.fenceDoesBoundingBoxesOverlap(sB3, sBC) == true;
	
	var tB4r = this.fenceDoesBoundingBoxesOverlap(sB4, sBC) == true;
	var tB5r = this.fenceDoesBoundingBoxesOverlap(sB5, sBC) == true;
	var tB6r = this.fenceDoesBoundingBoxesOverlap(sB6, sBC) == true;
	
	var tB7r = this.fenceDoesBoundingBoxesOverlap(sB7, sBC) == true;
	var tB8r = this.fenceDoesBoundingBoxesOverlap(sB8, sBC) == true;
	var tB9r = this.fenceDoesBoundingBoxesOverlap(sB9, sBC) == true;

	console.log(t1, t2, t3, t4, t5, t6);
	console.log(tA1, tA2, tA3, tA4, tA5, tA6, tA7, tA8);
	console.log(tA1r, tA2r, tA3r, tA4r, tA5r, tA6r, tA7r, tA8r);
	console.log(tB1, tB2, tB3, tB4, tB5, tB6, tB7, tB8, tB9);
	console.log(tB1r, tB2r, tB3r, tB4r, tB5r, tB6r, tB7r, tB8r, tB9r);
}

this.fenceDoesBoundingBoxesOverlap = function(section1, section2)
{
	if (Math.max(section1.a.x, section1.b.x) >= Math.min(section2.a.x, section2.b.x)
		&& Math.min(section1.a.x, section1.b.x) <= Math.max(section2.a.x, section2.b.x)
		&& Math.max(section1.a.y, section1.b.y) >= Math.min(section2.a.y, section2.b.y)
		&& Math.min(section1.a.y, section1.b.y) <= Math.max(section2.a.y, section2.b.y))
	{
		return true;
	}
	
	return false;
}
















// for (i=0; i<this.state.areaDraft.length; i++)
// CHECK: crossing any other fence
for (p=0; p<this.settings.playerCount; p++)
{
	var areas = this.state.players[p].areas;
	// iterate over all player's bases
	for (i=0; i<areas.length; i++)
	{
		var area = areas[i];

		// ignore bases with just one or no posts
		if (area.length <= 1)
		{
			continue;
		}

		// iterate over all posts in this base
		// except the first one
		var postFirst = area[0];
		var postPrevious = postFirst;
		for (j=1; j<area.length; j++)
		{
!!!					if (this.fenceDoesCross({a:{x:postPrevious.x, y:postPrevious.y},
				b:{x:area[j].x, y:area[j].y}},
				{a:{x:vertexPrevious.x, y:vertexPrevious.y},
				b:{x:coordinates.x, y:coordinates.y}}))
			{
				return false;
			}

			postPrevious = area[j];
		}
	}
}
