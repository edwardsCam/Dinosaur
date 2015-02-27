using System;

namespace Attribute
{
	public class Intelligence : Attribute
	{
		
		public Intelligence () : base()
		{
			GetBenefitsFromPoints ();
		}
		
		#region Attribute methods
		
		public void Add (float p)
		{
			base.AddPoints (p, false);
		}
		
		protected override void GetBenefitsFromPoints ()
		{
			//no benefits here.
			//all benefits are applied to other attributes
		}
		
		#endregion
	}
}

