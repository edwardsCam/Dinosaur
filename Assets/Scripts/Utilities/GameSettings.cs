using UnityEngine;
using System.Collections;
using Assets.Scripts.Utilities;

namespace Assets.Scripts.Utilities
{
    public class GameSettings: MonoBehaviour
    {
        public Dinosaur currentDino;

        void Awake()
        {
            DontDestroyOnLoad(transform.gameObject);
        }
        public Dinosaur GetCurrentDinosaur()
        {
            return currentDino;
        }

        public void SetCurrentDinosaur(Dinosaur dino)
        {
            currentDino = dino;
        }

        
    }
}
