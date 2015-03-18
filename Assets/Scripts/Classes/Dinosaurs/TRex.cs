using System;

public class TRex : Dinosaur
{

	public TRex () : base()
	{
		AddPointsTo_Strength (4);
		AddPointsTo_Energy (1);
		AddPointsTo_Sensory (1);
		AddPointsTo_Survivability (2);
	}
}
