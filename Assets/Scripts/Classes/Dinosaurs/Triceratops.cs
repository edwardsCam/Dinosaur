namespace Species
{
	public class Triceratops : Dinosaur
	{
		public Triceratops () : base()
		{
			//these numbers are taken from https://docs.google.com/spreadsheets/d/1iFu6LpLsf9QlxIve1ivWTQ2Rtc8C55LqGwW69TnCPdY
			AddPointsTo_Strength (2);
			AddPointsTo_Energy (3);
			AddPointsTo_Reproducibility (1);
			AddPointsTo_Survivability (2);
		}
	}
}