using System;

namespace Attribute
{
	public class Sensory : Attribute
	{
		
		private Benefit min_fov;
		private Benefit max_fov;
		private Benefit distance;
		private Benefit detect_radius;
		
		public Sensory () : base()
		{
			min_fov = new Benefit (false);
			max_fov = new Benefit (false);
			distance = new Benefit (false);
			detect_radius = new Benefit ();
			GetBenefitsFromPoints ();
		}
		
		#region Attribute methods
		
		public void Add (float p, bool is_intel_bonus)
		{
			base.AddPoints (p, is_intel_bonus);
		}
		
		protected override void GetBenefitsFromPoints ()
		{
			float p = base.Points ();
			min_fov.SetBase (Calculate._minFieldOfView (p));
			max_fov.SetBase (Calculate._maxFieldOfView (p));
			distance.SetBase (Calculate._distance (p));
			detect_radius.SetBase (Calculate._detectRadius (p));
		}
		
		#endregion
		
		#region Getters
		
		public float _MinFieldOfView ()
		{
			return min_fov.Value ();
		}
		
		public float _MaxFieldOfView ()
		{
			return max_fov.Value ();
		}
		
		public float _VisibilityDistance ()
		{
			return distance.Value ();
		}

		public float _DetectRadius ()
		{
			return detect_radius.Value ();
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

		public void AddTo_DetectRadius_Base (float b)
		{
			detect_radius.AddTo_Base (b);
		}

		public void AddTo_DetectRadius_Modifier (float m)
		{
			detect_radius.AddTo_Modifier (m);
		}
		
		#endregion
	}
}
