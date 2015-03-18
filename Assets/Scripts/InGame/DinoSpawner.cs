using UnityEngine;
using System.Collections;
using Assets.Scripts.Utilities;
using Assets.Scripts;

public class DinoSpawner : MonoBehaviour {

    public GameObject tRex;
    public GameObject smallDino;
    public GameObject raptor;
	// Use this for initialization
//	void Start () {
//        GameSettings settings = GameObject.FindGameObjectWithTag("Settings").GetComponent<GameSettings>();
//        SpawnDino(settings.GetCurrentDinosaur());
//
//        DestroySpawner();
//	
//	}
	
    private void DestroySpawner()
    {
        Destroy(gameObject, 3);
    }
	
    private void SpawnDino(Dinosaur dino)
    {
        //I know this is bad code but I'm using it as a hotfix.
//        if(dino == Dinosaur.TRex)
//        {
//            Spawn(tRex);
//        }
//        else if (dino == Dinosaur.Small)
//        {
//            Spawn(smallDino);
//        }
//        else if (dino == Dinosaur.Raptor)
//        {
//            Spawn(raptor);
//        }
    }

    private void Spawn(GameObject dino)
    {
        GameObject instance = (GameObject)GameObject.Instantiate(dino, transform.position, transform.rotation);
    }
}
