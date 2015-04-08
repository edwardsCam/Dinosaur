using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.AI.Allosaurus
{
	class AllosaurusAI : DinoAI
	{
		
		public new IDecision getNextDecision()
		{
			if (intelligence == null) {
				return new AllosaurusIdle ();
			} else if (intelligence is AllosaurusIdle) {
				return new AllosaurusApproach ();
			} else if (intelligence is AllosaurusApproach) {
				return new AllosaurusIdle ();
			} else {
				return base.getNextDecision ();
			}
		}
	}
}
