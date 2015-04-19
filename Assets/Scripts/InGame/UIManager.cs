using UnityEngine;
using System.Collections;

public class UIManager : MonoBehaviour {

    public Animator quitButton;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () 
    {
	    if(Input.GetKeyDown(KeyCode.Escape))
        {
                quitButton.enabled = true;
                if(quitButton.GetBool("isHidden"))
                    quitButton.SetBool("isHidden", false);
                else
                    quitButton.SetBool("isHidden", true);
          
        }
	}

    public void QuitClicked()
    {
        Application.LoadLevel("Opening Scene");
    }
}
