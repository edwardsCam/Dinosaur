using UnityEngine;
using System.Collections;
using Assets.Scripts;
using UnityEngine.UI;

public class VitalsVM : MonoBehaviour {

    public GameObject healthBar;
    public GameObject staminaBar;
    private Text healthText;
    private Slider healthSlider;
    private Text staminaText;
    private Slider staminaSlider;
    private DinoController dino;
    bool ready = false;
	// Use this for initialization
	public void Initialize() 
    {
        healthSlider = healthBar.GetComponent<Slider>();
        staminaSlider = staminaBar.GetComponent<Slider>();
        healthText = healthBar.GetComponentInChildren<Text>();
        staminaText = staminaBar.GetComponentInChildren<Text>();
        dino = GameObject.FindGameObjectWithTag("Player").GetComponent<DinoController>();
        ready = true;
    }
	
	// Update is called once per frame
	void Update () 
    {
        if (ready)
        {
            healthSlider.value = dino.GetDinosaur().Current_HP() / dino.GetDinosaur().Max_HP();
            staminaSlider.value = dino.GetDinosaur().Current_Stamina() / dino.GetDinosaur().Max_Stamina();
            healthText.text = ((int)dino.GetDinosaur().Current_HP()).ToString() + '/' + ((int)dino.GetDinosaur().Max_HP()).ToString();
            staminaText.text = ((int)dino.GetDinosaur().Current_Stamina()).ToString() + '/' + ((int)dino.GetDinosaur().Max_Stamina()).ToString();
        }

	}
}

