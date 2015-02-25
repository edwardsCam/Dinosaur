using System;

namespace Attributes
{
	public class Survivability : Attribute
	{
		private int respawn_time;
		private Benefit hp_regen;
		
		public Survivability () : base()
		{
			hp_regen = new Benefit ();
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
			hp_regen.SetBase (Calculate._hpRegen (p));
			respawn_time = Calculate._respawnTime (p);
		}
		
		#endregion
		
		#region Getters
		
		public float HP_Regen ()
		{
			return hp_regen.Value ();
		}
		
		public int RespawnTime ()
		{
			return respawn_time;
		}
		
		#endregion
	}
}

