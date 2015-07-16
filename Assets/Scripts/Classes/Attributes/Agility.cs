using System;

namespace Attribute
{
	public class Agility : Attribute
	{
		private Benefit movespeed;
		private Benefit attack_speed;

		public Agility () : base()
		{
			movespeed = new Benefit ();
			attack_speed = new Benefit ();
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
			movespeed.SetBase (Calculate._movespeed (p));
			attack_speed.SetBase (Calculate._attackSpeed (p));
		}
		
		#endregion

		#region Getters
		
		public float _Movespeed ()
		{
			return movespeed.Value ();
		}

		public float _AttackSpeed ()
		{
			return attack_speed.Value ();
		}
		
		#endregion

		#region Setters and Mutators
		
		public void AddTo_Movespeed_Base (float b)
		{
			movespeed.AddTo_Base (b);
		}

		public void AddTo_Movespeed_Modifier (float m)
		{
			movespeed.AddTo_Modifier (m);
		}

		public void AddTo_AttackSpeed_Base (float b)
		{
			attack_speed.AddTo_Base (b);
		}

		public void AddTo_AttackSpeed_Modifier (float m)
		{
			attack_speed.AddTo_Modifier (m);
		}
		
		#endregion
	}
}
