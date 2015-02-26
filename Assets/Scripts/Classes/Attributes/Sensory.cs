using System;

namespace Attribute
{
	public class Sensory : Attribute
	{
	
		private Benefit min_fov;
		private Benefit max_fov;
		private Benefit distance;
		
		public Sensory () : base()
		{
			min_fov = new Benefit (false);
			max_fov = new Benefit (false);
			distance = new Benefit (false);
			GetBenefitsFromPoints ();
		}
		
		#region Attribute methods
		
		public void Add (float p)
		{
			base.AddPoints (p);
		}
		
		protected override void GetBenefitsFromPoints ()
		{
			float p = base.Points ();
			min_fov.SetBase (Calculate._minFieldOfView (p));
			max_fov.SetBase (Calculate._maxFieldOfView (p));
			distance.SetBase (Calculate._distance (p));
		}
		
		#endregion
		
		#region Getters
		
		public int MinFieldOfView ()
		{
			return min_fov.ValueAsInt ();
		}
		
		public int MaxFieldOfView ()
		{
			return max_fov.ValueAsInt ();
		}
		
		public int VisibilityDistance ()
		{
			return distance.ValueAsInt ();
		}
		
		#endregion
		
		#region Setters and Mutators
		
		public void AddTo_MinFOV (int f)
		{
			min_fov.AddTo_Base (f);
		}
		
		public void AddTo_MaxFOV (int f)
		{
			max_fov.AddTo_Base (f);
		}
		
		public void AddTo_VisibilityDistance (int d)
		{
			distance.AddTo_Base (d);
		}
		
		#endregion
	}
}

