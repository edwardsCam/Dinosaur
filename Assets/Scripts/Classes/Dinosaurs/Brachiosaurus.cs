namespace Species
{
	public class Brachiosaurus : Dinosaur
	{
		public Brachiosaurus () : base()
		{
			//these numbers are taken from https://docs.google.com/spreadsheets/d/1iFu6LpLsf9QlxIve1ivWTQ2Rtc8C55LqGwW69TnCPdY
			AddPointsTo_Strength (2);
			AddPointsTo_Energy (1);
			AddPointsTo_Sensory (1);
			AddPointsTo_Survivability (4);
		}
	}
}