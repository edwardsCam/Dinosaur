using UnityEngine;
using System.Collections;
using Assets.Scripts.AI.Allosaurus;
using Assets.Scripts.AI.Triceratops;

namespace Assets.Scripts.AI
{
    class DinoAI :MonoBehaviour
    {
        private IDecision intelligence;
        public DinosaurType type;
        GameObject target;

        void Start()
        {
            if(type == DinosaurType.Allosaurus)
            {
                intelligence = new AllosaurusIdle();
            }
            else if(type == DinosaurType.Triceratops)
            {
                intelligence = new TriceratopsIdle();
            }

            target = null;
        }
        
        void Update()
        {
            intelligence.Decide(gameObject, target);
            intelligence.Act(gameObject, target);
        }

        public void UpdateDecision(IDecision choice)
        {
            intelligence = choice;
        }

        public void UpdateTarget(GameObject target)
        {
            this.target = target;
        }
    }
}
