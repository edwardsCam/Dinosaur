using System;

namespace Attributes
{
	public class Sensory : Attribute
	{
		
		public Sensory () : base()
		{
			GetBenefitsFromPoints ();
		}
		
		#region Attribute methods
		
		public void Add (float p)
		{
			base.AddPoints (p);
		}
		
		protected override void GetBenefitsFromPoints ()
		{
			
		}
		
		#endregion
	}
}

