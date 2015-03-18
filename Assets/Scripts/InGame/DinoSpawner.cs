using UnityEngine;
using System.Collections;
using Assets.Scripts.Utilities;
using Assets.Scripts;

public class DinoSpawner : MonoBehaviour {

    public GameObject tRex;
    public GameObject smallDino;
    public GameObject raptor;
	// Use this for initialization
	void Awake () {
        GameSettings settings = GameObject.FindGameObjectWithTag("Settings").GetComponent<GameSettings>();
        SpawnDino(settings.GetCurrentDinosaur());
        StartUI();
        DestroySpawner();
	
	}

    private void StartUI()
    {
        GameObject.FindGameObjectWithTag("UIManager").GetComponent<VitalsVM>().Initialize();
    }
	
    private void DestroySpawner()
    {
		//test
        Destroy(gameObject, 3);
    }

    private void SpawnDino(DinosaurType dino)
    {
        //I know this is bad code but I'm using it as a hotfix.
        if (dino == DinosaurType.TRex)
        {
            Spawn(tRex);
        }
        else if (dino == DinosaurType.Small)
        {
            Spawn(smallDino);
        }
        else if (dino == DinosaurType.Raptor)
        {
            Spawn(raptor);
        }
    }

    private void Spawn(GameObject dino)
    {
        GameObject instance = (GameObject)GameObject.Instantiate(dino, transform.position, transform.rotation);
        instance.tag = "Player";
    }
}
