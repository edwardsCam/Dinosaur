using System;

namespace Attribute
{
	public class Reproducibility : Attribute
	{
	
		private Benefit rebirth_penalty;
		private Benefit respawn_time;
		
		public Reproducibility () : base()
		{
			rebirth_penalty = new Benefit (false);
			respawn_time = new Benefit (false);
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
			respawn_time.SetBase (Calculate._respawnTime (p));
			rebirth_penalty.SetBase (Calculate._rebirthPenalty (p));
		}
		
		#endregion
		
		#region Getters
		
		public int RespawnTime ()
		{
			return respawn_time.ValueAsInt ();
		}
		
		public float RebirthPenalty ()
		{
			return rebirth_penalty.ValueAsInt ();
		}
		
		#endregion
		
		#region Setters and Mutators
		
		public void AddTo_RespawnTime (int t)
		{
			respawn_time.AddTo_Base (t);
		}
		
		public void AddTo_RebirthPenalty (float p)
		{
			rebirth_penalty.AddTo_Base (p);
		}
		
		#endregion
	}
}

